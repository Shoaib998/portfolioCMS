import api from "./api";

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  technologies?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  projectImage?: string | null;
  featured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectPayload {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  technologies?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  sortOrder: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<ApiResponse<Project[]>>("/projects");
  return response.data.data;
};

export const createProject = async (
  payload: ProjectPayload
): Promise<Project> => {
  const response = await api.post<ApiResponse<Project>>(
    "/projects",
    payload
  );
  return response.data.data;
};

export const updateProject = async (
  id: string,
  payload: Partial<ProjectPayload>
): Promise<Project> => {
  const response = await api.put<ApiResponse<Project>>(
    `/projects/${id}`,
    payload
  );
  return response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const uploadProjectImage = async (
  id: string,
  file: File
): Promise<Project> => {
  const formData = new FormData();
  formData.append("projectImage", file);

  const response = await api.patch<ApiResponse<Project>>(
    `/projects/${id}/image`,
    formData
  );

  return response.data.data;
};
