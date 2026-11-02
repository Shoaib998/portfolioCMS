import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  uploadProjectImage,
  type Project,
  type ProjectPayload,
} from "../../services/project.service";

const API_ORIGIN = "http://localhost:5000";

const emptyForm: ProjectPayload = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  sortOrder: 0,
};

const getErrorMessage = (error: unknown): string => {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return (
    err.response?.data?.message ||
    err.message ||
    "Something went wrong. Please try again."
  );
};

const imageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectPayload>({ ...emptyForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !term ||
        project.title.toLowerCase().includes(term) ||
        project.slug.toLowerCase().includes(term) ||
        (project.technologies || "").toLowerCase().includes(term);

      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && project.featured) ||
        (featuredFilter === "regular" && !project.featured);

      return matchesSearch && matchesFeatured;
    });
  }, [projects, search, featuredFilter]);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setImagePreview("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      technologies: project.technologies || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured,
      sortOrder: project.sortOrder ?? 0,
    });
    setImageFile(null);
    setImagePreview(imageUrl(project.projectImage));
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setImageFile(null);
    setImagePreview("");
    setError("");
  };

  const updateField = <K extends keyof ProjectPayload>(
    key: K,
    value: ProjectPayload[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const makePayload = (): ProjectPayload => {
    const payload: ProjectPayload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
    };

    const optionalFields = {
      shortDescription: form.shortDescription?.trim(),
      description: form.description?.trim(),
      technologies: form.technologies?.trim(),
      githubUrl: form.githubUrl?.trim(),
      liveUrl: form.liveUrl?.trim(),
    };

    if (optionalFields.shortDescription) {
      payload.shortDescription = optionalFields.shortDescription;
    }
    if (optionalFields.description) {
      payload.description = optionalFields.description;
    }
    if (optionalFields.technologies) {
      payload.technologies = optionalFields.technologies;
    }
    if (optionalFields.githubUrl) {
      payload.githubUrl = optionalFields.githubUrl;
    }
    if (optionalFields.liveUrl) {
      payload.liveUrl = optionalFields.liveUrl;
    }

    return payload;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.title.trim().length < 2) {
      setError("Please enter a project title with at least 2 characters.");
      return;
    }

    if (form.slug.trim().length < 2) {
      setError("Please enter a valid slug with at least 2 characters.");
      return;
    }

    try {
      setSaving(true);
      const payload = makePayload();
      let savedProject: Project;

      if (editingProject) {
        savedProject = await updateProject(editingProject.id, payload);
      } else {
        savedProject = await createProject(payload);
      }

      if (imageFile) {
        savedProject = await uploadProjectImage(savedProject.id, imageFile);
      }

      setProjects((current) => {
        const exists = current.some((item) => item.id === savedProject.id);

        const next = exists
          ? current.map((item) =>
              item.id === savedProject.id ? savedProject : item
            )
          : [...current, savedProject];

        return next.sort(
          (a, b) =>
            (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
            (b.createdAt || "").localeCompare(a.createdAt || "")
        );
      });

      setSuccess(
        editingProject
          ? "Project updated successfully."
          : "Project created successfully."
      );
      setModalOpen(false);
      setImageFile(null);
      setImagePreview("");
      await loadProjects();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteProject(project.id);
      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      );
      setSuccess("Project deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleImageChange = (file?: File) => {
    setError("");

    if (!file) {
      setImageFile(null);
      setImagePreview(editingProject?.projectImage
        ? imageUrl(editingProject.projectImage)
        : "");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">
              Portfolio CMS / Content
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Projects
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your portfolio projects, links, images and featured work.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <span className="mr-2 text-lg">+</span> Add Project
          </button>
        </div>

        {error && !modalOpen && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Projects" value={projects.length} />
          <StatCard label="Featured Projects" value={featuredCount} />
          <StatCard
            label="Other Projects"
            value={projects.length - featuredCount}
          />
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, slug or technology..."
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <select
            value={featuredFilter}
            onChange={(event) => setFeaturedFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="all">All projects</option>
            <option value="featured">Featured only</option>
            <option value="regular">Non-featured</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mb-3 text-4xl">📁</div>
            <h2 className="font-semibold text-slate-800">
              {projects.length === 0
                ? "No projects yet"
                : "No matching projects"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {projects.length === 0
                ? "Add your first project to get started."
                : "Try a different search term or filter."}
            </p>
            {projects.length === 0 && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Add your first project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-100">
                  {project.projectImage ? (
                    <img
                      src={imageUrl(project.projectImage)}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="text-4xl">🖼️</div>
                      <p className="mt-2 text-xs">No project image</p>
                    </div>
                  )}

                  {project.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      ★ Featured
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                    Order: {project.sortOrder ?? 0}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {project.title}
                  </h2>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    /{project.slug}
                  </p>

                  <p className="mt-3 min-h-10 text-sm leading-5 text-slate-600">
                    {project.shortDescription || "No short description provided."}
                  </p>

                  {project.technologies && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.technologies
                        .split(",")
                        .map((technology) => technology.trim())
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((technology) => (
                          <span
                            key={technology}
                            className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                          >
                            {technology}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-slate-600 hover:text-indigo-600"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>

                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => openEditModal(project)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(project)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 py-6 sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingProject ? "Edit Project" : "Add Project"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter project information below.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="rounded-lg px-3 py-1 text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                      {error}
                    </div>
                  )}

                  <FormField label="Project Title *">
                    <input
                      required
                      minLength={2}
                      value={form.title}
                      onChange={(event) => {
                        const title = event.target.value;
                        updateField("title", title);
                        if (!editingProject) {
                          updateField(
                            "slug",
                            title
                              .toLowerCase()
                              .trim()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-|-$/g, "")
                          );
                        }
                      }}
                      className={inputClass}
                      placeholder="e.g. Portfolio Website"
                    />
                  </FormField>

                  <FormField label="Slug *">
                    <input
                      required
                      minLength={2}
                      value={form.slug}
                      onChange={(event) =>
                        updateField("slug", event.target.value)
                      }
                      className={inputClass}
                      placeholder="portfolio-website"
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="Short Description">
                      <textarea
                        rows={2}
                        value={form.shortDescription || ""}
                        onChange={(event) =>
                          updateField("shortDescription", event.target.value)
                        }
                        className={inputClass}
                        placeholder="A brief summary of this project..."
                      />
                    </FormField>
                  </div>

                  <div className="sm:col-span-2">
                    <FormField label="Full Description">
                      <textarea
                        rows={4}
                        value={form.description || ""}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Describe the project, its purpose and features..."
                      />
                    </FormField>
                  </div>

                  <div className="sm:col-span-2">
                    <FormField label="Technologies (comma-separated)">
                      <input
                        value={form.technologies || ""}
                        onChange={(event) =>
                          updateField("technologies", event.target.value)
                        }
                        className={inputClass}
                        placeholder="React, TypeScript, Node.js, MySQL"
                      />
                    </FormField>
                  </div>

                  <FormField label="GitHub URL">
                    <input
                      type="url"
                      value={form.githubUrl || ""}
                      onChange={(event) =>
                        updateField("githubUrl", event.target.value)
                      }
                      className={inputClass}
                      placeholder="https://github.com/..."
                    />
                  </FormField>

                  <FormField label="Live Demo URL">
                    <input
                      type="url"
                      value={form.liveUrl || ""}
                      onChange={(event) =>
                        updateField("liveUrl", event.target.value)
                      }
                      className={inputClass}
                      placeholder="https://example.com"
                    />
                  </FormField>

                  <FormField label="Sort Order">
                    <input
                      type="number"
                      step={1}
                      value={form.sortOrder}
                      onChange={(event) =>
                        updateField("sortOrder", Number(event.target.value))
                      }
                      className={inputClass}
                    />
                  </FormField>

                  <div className="flex items-center">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(event) =>
                          updateField("featured", event.target.checked)
                        }
                        className="h-4 w-4 accent-indigo-600"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          Featured Project
                        </span>
                        <span className="block text-xs text-slate-500">
                          Highlight this project on your portfolio.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <FormField label="Project Image">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleImageChange(event.target.files?.[0])
                        }
                        className="block w-full cursor-pointer rounded-xl border border-slate-200 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Image uploads after the project is saved.
                      </p>

                      {imagePreview && (
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Project preview"
                            className="h-44 w-full rounded-xl border border-slate-200 object-cover sm:w-80"
                          />
                        </div>
                      )}
                    </FormField>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingProject
                        ? "Save Changes"
                        : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}