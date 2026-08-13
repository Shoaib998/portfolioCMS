import prisma from "../../config/prisma";
import {
  DashboardResponse,
} from "./dashboard.types";

export class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    const [
      projectsTotal,
      projectsFeatured,

      blogsTotal,
      blogsPublished,
      blogsDraft,

      servicesTotal,
      servicesActive,

      skillsTotal,
      skillsActive,

      galleryTotal,
      galleryActive,

      testimonialsTotal,
      testimonialsActive,

      contactsTotal,
      contactsUnread,

      recentProjects,
      recentBlogs,
      recentContacts,
      recentTestimonials,
    ] = await Promise.all([
      // =========================
      // Projects
      // =========================

      prisma.project.count(),

      prisma.project.count({
        where: {
          featured: true,
        },
      }),

      // =========================
      // Blogs
      // =========================

      prisma.blog.count(),

      prisma.blog.count({
        where: {
          status: "published",
        },
      }),

      prisma.blog.count({
        where: {
          status: "draft",
        },
      }),

      // =========================
      // Services
      // =========================

      prisma.service.count(),

      prisma.service.count({
        where: {
          isActive: true,
        },
      }),

      // =========================
      // Skills
      // =========================

      prisma.skill.count(),

      prisma.skill.count({
        where: {
          isActive: true,
        },
      }),

      // =========================
      // Gallery
      // =========================

      prisma.gallery.count(),

      prisma.gallery.count({
        where: {
          isActive: true,
        },
      }),

      // =========================
      // Testimonials
      // =========================

      prisma.testimonial.count(),

      prisma.testimonial.count({
        where: {
          isActive: true,
        },
      }),

      // =========================
      // Contacts
      // =========================

      prisma.contact.count(),

      prisma.contact.count({
        where: {
          status: {
            not: "read",
          },
        },
      }),

      // =========================
      // Recent Projects
      // =========================

      prisma.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      // =========================
      // Recent Blogs
      // =========================

      prisma.blog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      // =========================
      // Recent Contacts
      // =========================

      prisma.contact.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      // =========================
      // Recent Testimonials
      // =========================

      prisma.testimonial.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    return {
      stats: {
        projects: {
          total: projectsTotal,
          featured: projectsFeatured,
        },

        blogs: {
          total: blogsTotal,
          published: blogsPublished,
          draft: blogsDraft,
        },

        services: {
          total: servicesTotal,
          active: servicesActive,
        },

        skills: {
          total: skillsTotal,
          active: skillsActive,
        },

        gallery: {
          total: galleryTotal,
          active: galleryActive,
        },

        testimonials: {
          total: testimonialsTotal,
          active: testimonialsActive,
        },

        contacts: {
          total: contactsTotal,
          unread: contactsUnread,
        },
      },

      recent: {
        recentProjects,
        recentBlogs,
        recentContacts,
        recentTestimonials,
      },
    };
  }
}

export default new DashboardService();