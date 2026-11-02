import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDashboardData,
  type DashboardData,
} from "../../services/dashboard.service";
const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const result = await getDashboardData();

        if (active) {
          setData(result);
          setError("");
        }
      } catch {
        if (active) {
          setError("Dashboard data could not be loaded.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const stats = data
    ? [
        {
          label: "Projects",
          value: data.stats.projects.total,
          detail: `${data.stats.projects.featured} featured`,
          path: "/projects",
        },
        {
          label: "Blogs",
          value: data.stats.blogs.total,
          detail: `${data.stats.blogs.published} published · ${data.stats.blogs.draft} drafts`,
          path: "/blogs",
        },
        {
          label: "Services",
          value: data.stats.services.total,
          detail: `${data.stats.services.active} active`,
          path: "/services",
        },
        {
          label: "Skills",
          value: data.stats.skills.total,
          detail: `${data.stats.skills.active} active`,
          path: "/skills",
        },
        {
          label: "Gallery",
          value: data.stats.gallery.total,
          detail: `${data.stats.gallery.active} active`,
          path: "/gallery",
        },
        {
          label: "Testimonials",
          value: data.stats.testimonials.total,
          detail: `${data.stats.testimonials.active} active`,
          path: "/testimonials",
        },
        {
          label: "Contacts",
          value: data.stats.contacts.total,
          detail: `${data.stats.contacts.unread} new messages`,
          path: "/contacts",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm text-red-700">
          {error || "Dashboard data is unavailable."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your portfolio content.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {stat.detail}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Recent Projects
          </h2>

          {data.recent.recentProjects.length === 0 ? (
            <p className="text-sm text-slate-500">
              No projects yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recent.recentProjects.map((project) => (
                <li key={project.id} className="py-3">
                  <p className="font-medium text-slate-800">
                    {project.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Recent Blogs
          </h2>

          {data.recent.recentBlogs.length === 0 ? (
            <p className="text-sm text-slate-500">
              No blogs yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recent.recentBlogs.map((blog) => (
                <li key={blog.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      {blog.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-600">
                    {blog.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Recent Contacts
          </h2>

          {data.recent.recentContacts.length === 0 ? (
            <p className="text-sm text-slate-500">
              No contact messages yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recent.recentContacts.map((contact) => (
                <li key={contact.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-800">
                        {contact.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {contact.email}
                      </p>
                      {contact.subject && (
                        <p className="mt-1 text-sm text-slate-600">
                          {contact.subject}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-600">
                      {contact.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Recent Testimonials
          </h2>

          {data.recent.recentTestimonials.length === 0 ? (
            <p className="text-sm text-slate-500">
              No testimonials yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recent.recentTestimonials.map((item) => (
                <li key={item.id} className="py-3">
                  <p className="font-medium text-slate-800">
                    {item.name}
                  </p>
                  {item.designation && (
                    <p className="text-sm text-slate-500">
                      {item.designation}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;