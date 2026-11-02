
import api from "./api";

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  proficiency?: string | null;
  percentage?: number | null;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillPayload {
  name: string;
  slug: string;
  category?: string;
  proficiency?: string;
  percentage?: number;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get<ApiResponse<Skill[]>>("/skills");
  return response.data.data;
};

export const createSkill = async (
  payload: SkillPayload
): Promise<Skill> => {
  const response = await api.post<ApiResponse<Skill>>(
    "/skills",
    payload
  );

  return response.data.data;
};

export const updateSkill = async (
  id: string,
  payload: SkillPayload
): Promise<Skill> => {
  const response = await api.put<ApiResponse<Skill>>(
    `/skills/${id}`,
    payload
  );

  return response.data.data;
};

export const deleteSkill = async (id: string): Promise<void> => {
  await api.delete(`/skills/${id}`);
};
