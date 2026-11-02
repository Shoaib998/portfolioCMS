export interface CreateTestimonialDto {
  name: string;
  designation?: string;
  company?: string;
  message: string;
  avatar?: string;
  rating?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateTestimonialDto {
  name?: string;
  designation?: string;
  company?: string;
  message?: string;
  rating?: number;
  sortOrder?: number;
  isActive?: boolean;
}