export interface DashboardStats {
  projects: {
   total: number;
   featured: number;
  };

  blogs: {
    total: number;
    published: number;
    draft: number;
  };

  services: {
    total: number;
    active: number;
  };

  skills: {
    total: number;
    active: number;
  };

  gallery: {
    total: number;
    active: number;
  };

  testimonials: {
    total: number;
    active: number;
  };

  contacts: {
    total: number;
    unread: number;
  };
}

export interface DashboardRecentData {
  recentProjects: unknown[];
  recentBlogs: unknown[];
  recentContacts: unknown[];
  recentTestimonials: unknown[];
}

export interface DashboardResponse {
  stats: DashboardStats;
  recent: DashboardRecentData;
}