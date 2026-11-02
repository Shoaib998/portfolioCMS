import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  createBlog,
  deleteBlog,
  getBlogs,
  updateBlog,
  uploadBlogImage,
  type Blog,
  type BlogPayload,
  type BlogStatus,
} from "../../services/blog.service";

const API_ORIGIN = "http://localhost:5000";

const emptyForm: BlogPayload = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

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

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [form, setForm] = useState<BlogPayload>({ ...emptyForm });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBlogs();
      setBlogs(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBlogs();
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const filteredBlogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !term ||
        blog.title.toLowerCase().includes(term) ||
        blog.slug.toLowerCase().includes(term) ||
        (blog.excerpt || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || blog.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, statusFilter]);

  const publishedCount = blogs.filter(
    (blog) => blog.status === "published"
  ).length;

  const draftCount = blogs.filter(
    (blog) => blog.status === "draft"
  ).length;

  const updateField = <K extends keyof BlogPayload>(
    key: K,
    value: BlogPayload[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setForm({ ...emptyForm });

    setImageFile(null);
    setImagePreview("");

    setError("");
    setModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);

    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content,
      status: blog.status,
      publishedAt: blog.publishedAt || undefined,
    });

    setImageFile(null);
    setImagePreview(imageUrl(blog.featuredImage));

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

  const makePayload = (): BlogPayload => {
    const payload: BlogPayload = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      content: form.content.trim(),
      status: form.status,
    };

    const excerpt = form.excerpt?.trim();

    if (excerpt) {
      payload.excerpt = excerpt;
    }

    if (form.status === "published") {
      payload.publishedAt =
        form.publishedAt || new Date().toISOString();
    }

    return payload;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (form.title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    if (form.slug.trim().length < 3) {
      setError("Slug must be at least 3 characters.");
      return;
    }

    if (form.content.trim().length < 10) {
      setError("Content must be at least 10 characters.");
      return;
    }

    try {
      setSaving(true);

      const payload = makePayload();

      let savedBlog: Blog;

      if (editingBlog) {
        savedBlog = await updateBlog(editingBlog.id, payload);
      } else {
        savedBlog = await createBlog(payload);
      }

      if (imageFile) {
        savedBlog = await uploadBlogImage(
          savedBlog.id,
          imageFile
        );
      }

      setBlogs((current) => {
        const exists = current.some(
          (item) => item.id === savedBlog.id
        );

        if (exists) {
          return current.map((item) =>
            item.id === savedBlog.id ? savedBlog : item
          );
        }

        return [savedBlog, ...current];
      });

      setSuccess(
        editingBlog
          ? "Blog updated successfully."
          : "Blog created successfully."
      );

      setModalOpen(false);
      setImageFile(null);
      setImagePreview("");

      await loadBlogs();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog: Blog) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteBlog(blog.id);

      setBlogs((current) =>
        current.filter((item) => item.id !== blog.id)
      );

      setSuccess("Blog deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleImageChange = (file?: File) => {
    setError("");

    if (!file) {
      setImageFile(null);
      setImagePreview(
        editingBlog?.featuredImage
          ? imageUrl(editingBlog.featuredImage)
          : ""
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">
              Portfolio CMS / Content
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Blog Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, manage and publish your blog articles.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            + Add Blog
          </button>
        </div>

        {/* Messages */}

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

        {/* Statistics */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Blogs" value={blogs.length} />

          <StatCard
            label="Published"
            value={publishedCount}
          />

          <StatCard
            label="Drafts"
            value={draftCount}
          />
        </div>

        {/* Search and Filter */}

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, slug or excerpt..."
            className={inputClass}
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="all">All Blogs</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        {/* Blog Listing */}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading blogs...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mb-3 text-4xl">📝</div>

            <h2 className="font-semibold text-slate-800">
              {blogs.length === 0
                ? "No blogs yet"
                : "No matching blogs"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {blogs.length === 0
                ? "Create your first blog article."
                : "Try another search term or filter."}
            </p>

            {blogs.length === 0 && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Add Your First Blog
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-48 items-center justify-center overflow-hidden bg-slate-100">
                  {blog.featuredImage ? (
                    <img
                      src={imageUrl(blog.featuredImage)}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="text-4xl">🖼️</div>
                      <p className="mt-2 text-xs">
                        No featured image
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        blog.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {blog.status === "published"
                        ? "Published"
                        : "Draft"}
                    </span>

                    <span className="text-xs text-slate-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {blog.title}
                  </h2>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    /{blog.slug}
                  </p>

                  <p className="mt-3 min-h-10 text-sm leading-5 text-slate-600">
                    {blog.excerpt ||
                      "No excerpt provided for this blog."}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    Author: {blog.author?.fullName || "Admin"}
                  </p>

                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => openEditModal(blog)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(blog)}
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

        {/* Create/Edit Modal */}

        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 py-6 sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

              {/* Modal Header */}

              <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingBlog ? "Edit Blog" : "Create Blog"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter your blog article information.
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

                  {/* Title */}

                  <FormField label="Blog Title *">
                    <input
                      required
                      minLength={3}
                      value={form.title}
                      onChange={(event) => {
                        const title = event.target.value;

                        updateField("title", title);

                        if (!editingBlog) {
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
                      placeholder="e.g. Getting Started with React"
                    />
                  </FormField>

                  {/* Slug */}

                  <FormField label="Slug *">
                    <input
                      required
                      minLength={3}
                      pattern="[a-z0-9]+(-[a-z0-9]+)*"
                      value={form.slug}
                      onChange={(event) =>
                        updateField(
                          "slug",
                          event.target.value.toLowerCase()
                        )
                      }
                      className={inputClass}
                      placeholder="getting-started-with-react"
                    />
                  </FormField>

                  {/* Excerpt */}

                  <div className="sm:col-span-2">
                    <FormField label="Excerpt">
                      <textarea
                        rows={3}
                        value={form.excerpt || ""}
                        onChange={(event) =>
                          updateField("excerpt", event.target.value)
                        }
                        className={inputClass}
                        placeholder="A short summary of your blog..."
                      />
                    </FormField>
                  </div>

                  {/* Content */}

                  <div className="sm:col-span-2">
                    <FormField label="Blog Content *">
                      <textarea
                        required
                        minLength={10}
                        rows={8}
                        value={form.content}
                        onChange={(event) =>
                          updateField("content", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Write your blog content here..."
                      />
                    </FormField>

                    <p className="mt-1 text-xs text-slate-500">
                      Plain text content is supported by this form.
                    </p>
                  </div>

                  {/* Status */}

                  <FormField label="Status">
                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target.value as BlogStatus
                        )
                      }
                      className={inputClass}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </FormField>

                  {/* Published Date */}

                  <FormField label="Published Date">
                    <input
                      type="datetime-local"
                      value={
                        form.publishedAt
                          ? form.publishedAt.slice(0, 16)
                          : ""
                      }
                      onChange={(event) => {
                        const value = event.target.value;

                        updateField(
                          "publishedAt",
                          value
                            ? new Date(value).toISOString()
                            : undefined
                        );
                      }}
                      className={inputClass}
                    />
                  </FormField>

                  {/* Featured Image */}

                  <div className="sm:col-span-2">
                    <FormField label="Featured Image">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleImageChange(
                            event.target.files?.[0]
                          )
                        }
                        className="block w-full cursor-pointer rounded-xl border border-slate-200 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                      />

                      <p className="mt-1 text-xs text-slate-500">
                        Image uploads after the blog is saved.
                      </p>

                      {imagePreview && (
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Blog preview"
                            className="h-44 w-full rounded-xl border border-slate-200 object-cover sm:w-80"
                          />
                        </div>
                      )}
                    </FormField>
                  </div>
                </div>

                {/* Modal Footer */}

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
                      : editingBlog
                        ? "Save Changes"
                        : "Create Blog"}
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}