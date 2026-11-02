import api from "./api";

export interface DashboardData {
  stats: {
    projects: { total: number; featured: number };
    blogs: { total: number; published: number; draft: number };
    services: { total: number; active: number };
    skills: { total: number; active: number };
    gallery: { total: number; active: number };
    testimonials: { total: number; active: number };
    contacts: { total: number; unread: number };
  };
  recent: {
    recentProjects: {
      id: string;
      title: string;
      createdAt: string;
    }[];
    recentBlogs: {
      id: string;
      title: string;
      status: string;
      createdAt: string;
    }[];
    recentContacts: {
      id: string;
      name: string;
      email: string;
      subject?: string | null;
      status: string;
      createdAt: string;
    }[];
    recentTestimonials: {
      id: string;
      name: string;
      designation?: string | null;
      createdAt: string;
    }[];
  };
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get<{
    success: boolean;
    data: DashboardData;
  }>("/dashboard");

  return response.data.data;
};