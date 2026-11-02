export interface CreateBlogDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  status?: string;
  publishedAt?: Date;
}

export interface UpdateBlogDto {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  status?: string;
  publishedAt?: Date;
}