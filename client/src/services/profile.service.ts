
import api from "./api";

export interface Profile {
  id?: string;
  userId?: string;
  headline?: string | null;
  designation?: string | null;
  bio?: string | null;
  phone?: string | null;
  alternatePhone?: string | null;
  website?: string | null;
  location?: string | null;
  country?: string | null;
  github?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  profileImage?: string | null;
  resume?: string | null;
  user?: {
    fullName: string;
    email: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getProfile = async (): Promise<Profile | null> => {
  const response = await api.get<ApiResponse<Profile | null>>(
    "/profile"
  );
  return response.data.data;
};

export const updateProfile = async (
  data: Partial<Profile>
): Promise<Profile> => {
  const response = await api.put<ApiResponse<Profile>>(
    "/profile",
    data
  );
  return response.data.data;
};

export const uploadProfileImage = async (
  file: File
): Promise<Profile> => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await api.patch<ApiResponse<Profile>>(
    "/profile/image",
    formData
  );
  return response.data.data;
};

export const uploadResume = async (
  file: File
): Promise<Profile> => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.patch<ApiResponse<Profile>>(
    "/profile/resume",
    formData
  );
  return response.data.data;
};
