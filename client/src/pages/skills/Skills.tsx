
import { useEffect, useMemo, useState } from "react";
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from "../../services/skill.service";
import type {
  Skill,
  SkillPayload,
} from "../../services/skill.service";
import "./Skills.css";

const emptyForm: SkillPayload = {
  name: "",
  slug: "",
  category: "",
  proficiency: "",
  percentage: 0,
  icon: "",
  sortOrder: 0,
  isActive: true,
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<SkillPayload>({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSkills = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getSkills();
      setSkills(data);
    } catch {
      setError("Skills load nahi ho sakin. Please dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSkills();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        skills
          .map((skill) => skill.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    ).sort();
  }, [skills]);

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(query) ||
        skill.slug.toLowerCase().includes(query) ||
        (skill.category ?? "").toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        skill.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && skill.isActive) ||
        (statusFilter === "inactive" && !skill.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [skills, search, categoryFilter, statusFilter]);

  const activeCount = skills.filter((skill) => skill.isActive).length;

  const averagePercentage =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (total, skill) => total + (skill.percentage ?? 0),
            0
          ) / skills.length
        )
      : 0;

  const updateField = <K extends keyof SkillPayload>(
    key: K,
    value: SkillPayload[K]
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const generateSlug = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleNameChange = (value: string) => {
    setForm((previous) => {
      const oldGeneratedSlug = generateSlug(previous.name);

      const shouldGenerateSlug =
        !previous.slug ||
        previous.slug === oldGeneratedSlug;

      return {
        ...previous,
        name: value,
        slug: shouldGenerateSlug
          ? generateSlug(value)
          : previous.slug,
      };
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingId(skill.id);

    setForm({
      name: skill.name,
      slug: skill.slug,
      category: skill.category ?? "",
      proficiency: skill.proficiency ?? "",
      percentage: skill.percentage ?? 0,
      icon: skill.icon ?? "",
      sortOrder: skill.sortOrder,
      isActive: skill.isActive,
    });

    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: SkillPayload = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      category: form.category?.trim() || undefined,
      proficiency: form.proficiency?.trim() || undefined,
      icon: form.icon?.trim() || undefined,
      percentage: Number(form.percentage ?? 0),
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (editingId) {
        await updateSkill(editingId, payload);
      } else {
        await createSkill(payload);
      }

      setModalOpen(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      await loadSkills();
    } catch {
      setError(
        "Skill save nahi ho saki. Name, slug aur percentage check karein."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill: Skill) => {
    const confirmed = window.confirm(
      `Kya aap "${skill.name}" ko delete karna chahte hain?`
    );

    if (!confirmed) return;

    try {
      await deleteSkill(skill.id);

      setSkills((previous) =>
        previous.filter((item) => item.id !== skill.id)
      );
    } catch {
      setError("Skill delete nahi ho saki. Please dobara try karein.");
    }
  };

  const toggleStatus = async (skill: Skill) => {
    const payload: SkillPayload = {
      name: skill.name,
      slug: skill.slug,
      category: skill.category ?? "",
      proficiency: skill.proficiency ?? "",
      percentage: skill.percentage ?? 0,
      icon: skill.icon ?? "",
      sortOrder: skill.sortOrder,
      isActive: !skill.isActive,
    };

    try {
      await updateSkill(skill.id, payload);
      await loadSkills();
    } catch {
      setError("Skill status update nahi ho saka.");
    }
  };

  return (
    <main className="skills-page">
      <header className="skills-header">
        <div>
          <p className="skills-eyebrow">CONTENT MANAGEMENT</p>
          <h1>Skills Management</h1>
          <p className="skills-subtitle">
            Apni professional skills aur proficiency levels manage karein.
          </p>
        </div>

        <button
          className="skills-primary-btn"
          onClick={openCreateModal}
        >
          ＋ Add Skill
        </button>
      </header>

      <section className="skills-stats">
        <article className="skill-stat-card">
          <span>Total Skills</span>
          <strong>{skills.length}</strong>
          <small>All skills</small>
        </article>

        <article className="skill-stat-card">
          <span>Active Skills</span>
          <strong>{activeCount}</strong>
          <small>Visible on portfolio</small>
        </article>

        <article className="skill-stat-card">
          <span>Average Proficiency</span>
          <strong>{averagePercentage}%</strong>
          <small>Across all skills</small>
        </article>
      </section>

      {error && (
        <div className="skills-error" role="alert">
          {error}
        </div>
      )}

      <section className="skills-panel">
        <div className="skills-toolbar">
          <div>
            <h2>All Skills</h2>
            <p>Manage your skills and proficiency levels.</p>
          </div>

          <div className="skills-filters">
            <input
              type="search"
              placeholder="Search skills..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search skills"
            />

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="skills-empty">Loading skills...</div>
        ) : filteredSkills.length === 0 ? (
          <div className="skills-empty">
            <span className="skills-empty-icon">✦</span>
            <h3>No skills found</h3>
            <p>Add a skill or change your search filters.</p>

            <button
              className="skills-primary-btn"
              onClick={openCreateModal}
            >
              Add your first skill
            </button>
          </div>
        ) : (
          <div className="skills-table-wrap">
            <table className="skills-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Category</th>
                  <th>Proficiency</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSkills.map((skill) => (
                  <tr key={skill.id}>
                    <td>
                      <div className="skill-name-cell">
                        <div className="skill-icon-box">
                          {skill.icon || "✦"}
                        </div>

                        <div className="skill-name-info">
                          <strong>{skill.name}</strong>
                          <span>/{skill.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="skill-category">
                        {skill.category || "Uncategorized"}
                      </span>
                    </td>

                    <td>
                      <div className="skill-proficiency">
                        <div className="skill-progress-track">
                          <div
                            className="skill-progress-fill"
                            style={{
                              width: `${skill.percentage ?? 0}%`,
                            }}
                          />
                        </div>

                        <strong>{skill.percentage ?? 0}%</strong>
                      </div>
                    </td>

                    <td>
                      <span className="skill-order">
                        {skill.sortOrder}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`skill-status ${
                          skill.isActive
                            ? "skill-status-active"
                            : "skill-status-inactive"
                        }`}
                        onClick={() => void toggleStatus(skill)}
                      >
                        <span />
                        {skill.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <div className="skill-actions">
                        <button
                          type="button"
                          className="skill-edit-btn"
                          onClick={() => openEditModal(skill)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="skill-delete-btn"
                          onClick={() => void handleDelete(skill)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredSkills.length > 0 && (
          <footer className="skills-table-footer">
            Showing {filteredSkills.length} of {skills.length} skills
          </footer>
        )}
      </section>

      {modalOpen && (
        <div
          className="skill-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              setModalOpen(false);
            }
          }}
        >
          <section
            className="skill-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-modal-title"
          >
            <header className="skill-modal-header">
              <div>
                <p className="skills-eyebrow">
                  {editingId ? "UPDATE DETAILS" : "NEW SKILL"}
                </p>

                <h2 id="skill-modal-title">
                  {editingId ? "Edit Skill" : "Add Skill"}
                </h2>
              </div>

              <button
                type="button"
                className="skill-modal-close"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                aria-label="Close modal"
              >
                ×
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="skill-form-grid">
                <label>
                  Skill Name *
                  <input
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(event) =>
                      handleNameChange(event.target.value)
                    }
                    placeholder="e.g. React"
                  />
                </label>

                <label>
                  URL Slug *
                  <input
                    required
                    minLength={2}
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    title="Use lowercase letters, numbers and hyphens only"
                    value={form.slug}
                    onChange={(event) =>
                      updateField(
                        "slug",
                        event.target.value.toLowerCase()
                      )
                    }
                    placeholder="react"
                  />
                </label>

                <label>
                  Category
                  <input
                    value={form.category ?? ""}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    placeholder="e.g. Frontend"
                  />
                </label>

                <label>
                  Proficiency Level
                  <input
                    value={form.proficiency ?? ""}
                    onChange={(event) =>
                      updateField("proficiency", event.target.value)
                    }
                    placeholder="e.g. Advanced"
                  />
                </label>

                <label>
                  Percentage (0–100)
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={form.percentage ?? 0}
                    onChange={(event) =>
                      updateField(
                        "percentage",
                        Number(event.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Display Order
                  <input
                    type="number"
                    step={1}
                    value={form.sortOrder}
                    onChange={(event) =>
                      updateField(
                        "sortOrder",
                        Number(event.target.value)
                      )
                    }
                  />
                </label>

                <label className="skill-form-full">
                  Icon / Emoji
                  <input
                    value={form.icon ?? ""}
                    onChange={(event) =>
                      updateField("icon", event.target.value)
                    }
                    placeholder="e.g. ⚛️ or Code"
                  />
                </label>
              </div>

              <div className="skill-form-options">
                <label className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      updateField("isActive", event.target.checked)
                    }
                  />

                  <span>
                    <strong>Active</strong>
                    <small>
                      Make this skill visible to portfolio visitors.
                    </small>
                  </span>
                </label>
              </div>

              <footer className="skill-modal-footer">
                <button
                  type="button"
                  className="skill-cancel-btn"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="skills-primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Skill"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
