import api from "./api";
import type { LoginResponse, User } from "../types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", payload);

  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ success: boolean; data: User }>(
    "/auth/me"
  );

  return response.data.data;
};