export interface CreateProjectDto {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  technologies?: string;
  githubUrl?: string;
  liveUrl?: string;
  projectImage?: string;
  featured?: boolean;
  sortOrder?: number;
}

export interface UpdateProjectDto {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  technologies?: string;
  githubUrl?: string;
  liveUrl?: string;
  projectImage?: string;
  featured?: boolean;
  sortOrder?: number;
}