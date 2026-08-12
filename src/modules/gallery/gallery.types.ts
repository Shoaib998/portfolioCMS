export interface CreateGalleryDto {
  title: string;
  slug: string;
  description?: string;
  image: string;
  category?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateGalleryDto {
  title?: string;
  slug?: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  isActive?: boolean;
}