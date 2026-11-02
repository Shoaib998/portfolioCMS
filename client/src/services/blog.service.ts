import api from "./api";

export type BlogStatus = "draft" | "published";

export interface BlogAuthor {
  id: string;
  fullName: string;
  email: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  status: BlogStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: BlogAuthor;
}

export interface BlogPayload {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: BlogStatus;
  publishedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getBlogs = async (): Promise<Blog[]> => {
  const response = await api.get<ApiResponse<Blog[]>>("/blogs");
  return response.data.data;
};

export const createBlog = async (
  payload: BlogPayload
): Promise<Blog> => {
  const response = await api.post<ApiResponse<Blog>>(
    "/blogs",
    payload
  );

  return response.data.data;
};

export const updateBlog = async (
  id: string,
  payload: BlogPayload
): Promise<Blog> => {
  const response = await api.put<ApiResponse<Blog>>(
    `/blogs/${id}`,
    payload
  );

  return response.data.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await api.delete(`/blogs/${id}`);
};

export const uploadBlogImage = async (
  id: string,
  file: File
): Promise<Blog> => {
  const formData = new FormData();
  formData.append("blogImage", file);

  const response = await api.patch<ApiResponse<Blog>>(
    `/blogs/${id}/image`,
    formData
  );

  return response.data.data;
};