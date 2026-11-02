
import { useEffect, useMemo, useState } from "react";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../../services/service.service";
import type {
  Service,
  ServicePayload,
} from "../../services/service.service";
import "./Services.css";

const emptyForm: ServicePayload = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  icon: "",
  featured: false,
  sortOrder: 0,
  isActive: true,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<ServicePayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getServices();
      setServices(data);
    } catch {
      setError("Services load nahi ho sakin. Please dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(query) ||
        service.slug.toLowerCase().includes(query) ||
        (service.shortDescription ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && service.isActive) ||
        (statusFilter === "inactive" && !service.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [services, search, statusFilter]);

  const activeCount = services.filter((item) => item.isActive).length;
  const featuredCount = services.filter((item) => item.featured).length;

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription ?? "",
      description: service.description ?? "",
      icon: service.icon ?? "",
      featured: service.featured,
      sortOrder: service.sortOrder,
      isActive: service.isActive,
    });
    setError("");
    setModalOpen(true);
  };

  const updateField = <K extends keyof ServicePayload>(
    key: K,
    value: ServicePayload[K]
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    setForm((previous) => {
      const oldTitleSlug = previous.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const shouldGenerateSlug =
        !previous.slug ||
        previous.slug === oldTitleSlug;

      return {
        ...previous,
        title: value,
        slug: shouldGenerateSlug
          ? value
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : previous.slug,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: ServicePayload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      shortDescription: form.shortDescription?.trim() || undefined,
      description: form.description?.trim() || undefined,
      icon: form.icon?.trim() || undefined,
      sortOrder: Number(form.sortOrder),
    };

    try {
      if (editingId) {
        await updateService(editingId, payload);
      } else {
        await createService(payload);
      }

      setModalOpen(false);
      setForm({ ...emptyForm });
      setEditingId(null);
      await loadServices();
    } catch {
      setError(
        "Service save nahi ho saki. Title, slug aur backend validation check karein."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(
      `Kya aap "${service.title}" ko delete karna chahte hain?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteService(service.id);
      setServices((previous) =>
        previous.filter((item) => item.id !== service.id)
      );
    } catch {
      setError("Service delete nahi ho saki. Please dobara try karein.");
    }
  };

  const toggleStatus = async (service: Service) => {
    const payload: ServicePayload = {
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription ?? "",
      description: service.description ?? "",
      icon: service.icon ?? "",
      featured: service.featured,
      sortOrder: service.sortOrder,
      isActive: !service.isActive,
    };

    try {
      await updateService(service.id, payload);
      await loadServices();
    } catch {
      setError("Service status update nahi ho saka.");
    }
  };

  const toggleFeatured = async (service: Service) => {
    const payload: ServicePayload = {
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription ?? "",
      description: service.description ?? "",
      icon: service.icon ?? "",
      featured: !service.featured,
      sortOrder: service.sortOrder,
      isActive: service.isActive,
    };

    try {
      await updateService(service.id, payload);
      await loadServices();
    } catch {
      setError("Featured status update nahi ho saka.");
    }
  };

  return (
    <main className="services-page">
      <header className="services-header">
        <div>
          <p className="services-eyebrow">CONTENT MANAGEMENT</p>
          <h1>Services Management</h1>
          <p className="services-subtitle">
            Apni portfolio services ko manage aur organize karein.
          </p>
        </div>

        <button className="services-primary-btn" onClick={openCreateModal}>
          <span>＋</span> Add Service
        </button>
      </header>

      <section className="services-stats">
        <article className="service-stat-card">
          <span>Total Services</span>
          <strong>{services.length}</strong>
          <small>All services</small>
        </article>

        <article className="service-stat-card">
          <span>Active Services</span>
          <strong>{activeCount}</strong>
          <small>Visible on portfolio</small>
        </article>

        <article className="service-stat-card">
          <span>Featured Services</span>
          <strong>{featuredCount}</strong>
          <small>Highlighted services</small>
        </article>
      </section>

      {error && (
        <div className="services-error" role="alert">
          {error}
        </div>
      )}

      <section className="services-panel">
        <div className="services-toolbar">
          <div>
            <h2>All Services</h2>
            <p>Manage your service details and visibility.</p>
          </div>

          <div className="services-filters">
            <input
              type="search"
              placeholder="Search services..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search services"
            />

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
          <div className="services-empty">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="services-empty">
            <span className="services-empty-icon">✦</span>
            <h3>No services found</h3>
            <p>Add a new service or change your search filters.</p>
            <button
              className="services-primary-btn"
              onClick={openCreateModal}
            >
              Add your first service
            </button>
          </div>
        ) : (
          <div className="services-table-wrap">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Order</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-name-cell">
                        <div className="service-icon-box">
                          {service.icon || "✦"}
                        </div>
                        <div className="service-name-info">
                          <strong>{service.title}</strong>
                          <span>/{service.slug}</span>
                          {service.shortDescription && (
                            <small>{service.shortDescription}</small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="service-order">
                        {service.sortOrder}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`service-featured-toggle ${
                          service.featured ? "is-featured" : ""
                        }`}
                        onClick={() => void toggleFeatured(service)}
                        aria-label={`${
                          service.featured ? "Remove" : "Mark"
                        } ${service.title} as featured`}
                        title="Toggle featured"
                      >
                        {service.featured ? "★ Featured" : "☆ Feature"}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`service-status ${
                          service.isActive ? "status-active" : "status-inactive"
                        }`}
                        onClick={() => void toggleStatus(service)}
                        title="Toggle active status"
                      >
                        <span />
                        {service.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <div className="service-actions">
                        <button
                          type="button"
                          className="service-edit-btn"
                          onClick={() => openEditModal(service)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="service-delete-btn"
                          onClick={() => void handleDelete(service)}
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

        {!loading && filteredServices.length > 0 && (
          <footer className="services-table-footer">
            Showing {filteredServices.length} of {services.length} services
          </footer>
        )}
      </section>

      {modalOpen && (
        <div
          className="service-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setModalOpen(false);
            }
          }}
        >
          <section
            className="service-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <header className="service-modal-header">
              <div>
                <p className="services-eyebrow">
                  {editingId ? "UPDATE DETAILS" : "NEW SERVICE"}
                </p>
                <h2 id="service-modal-title">
                  {editingId ? "Edit Service" : "Add Service"}
                </h2>
              </div>

              <button
                type="button"
                className="service-modal-close"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                aria-label="Close modal"
              >
                ×
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="service-form-grid">
                <label>
                  Service Title *
                  <input
                    required
                    minLength={2}
                    value={form.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder="e.g. Web Development"
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
                      updateField("slug", event.target.value.toLowerCase())
                    }
                    placeholder="web-development"
                  />
                </label>

                <label className="service-form-full">
                  Short Description
                  <textarea
                    rows={2}
                    value={form.shortDescription ?? ""}
                    onChange={(event) =>
                      updateField("shortDescription", event.target.value)
                    }
                    placeholder="A short introduction to this service..."
                  />
                </label>

                <label className="service-form-full">
                  Full Description
                  <textarea
                    rows={4}
                    value={form.description ?? ""}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Describe the service in detail..."
                  />
                </label>

                <label>
                  Icon / Emoji
                  <input
                    value={form.icon ?? ""}
                    onChange={(event) => updateField("icon", event.target.value)}
                    placeholder="e.g. 💻 or Code"
                  />
                </label>

                <label>
                  Display Order
                  <input
                    type="number"
                    step="1"
                    value={form.sortOrder}
                    onChange={(event) =>
                      updateField("sortOrder", Number(event.target.value))
                    }
                  />
                </label>
              </div>

              <div className="service-form-options">
                <label className="service-checkbox">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateField("featured", event.target.checked)
                    }
                  />
                  <span>
                    <strong>Featured Service</strong>
                    <small>Highlight this service on the portfolio.</small>
                  </span>
                </label>

                <label className="service-checkbox">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      updateField("isActive", event.target.checked)
                    }
                  />
                  <span>
                    <strong>Active</strong>
                    <small>Make this service visible to visitors.</small>
                  </span>
                </label>
              </div>

              <footer className="service-modal-footer">
                <button
                  type="button"
                  className="service-cancel-btn"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="services-primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Service"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
