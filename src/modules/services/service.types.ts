export interface CreateServiceDto {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  featured?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateServiceDto {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  featured?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}