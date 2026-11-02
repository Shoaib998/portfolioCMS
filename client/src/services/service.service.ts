
import api from "./api";

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  icon?: string | null;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicePayload {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await api.get<ApiResponse<Service[]>>("/services");
  return response.data.data;
};

export const createService = async (
  payload: ServicePayload
): Promise<Service> => {
  const response = await api.post<ApiResponse<Service>>(
    "/services",
    payload
  );
  return response.data.data;
};

export const updateService = async (
  id: string,
  payload: ServicePayload
): Promise<Service> => {
  const response = await api.put<ApiResponse<Service>>(
    `/services/${id}`,
    payload
  );
  return response.data.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`/services/${id}`);
};
