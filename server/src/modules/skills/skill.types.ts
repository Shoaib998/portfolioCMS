export interface CreateSkillDto {
  name: string;
  slug: string;
  category?: string;
  proficiency?: string;
  percentage?: number;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateSkillDto {
  name?: string;
  slug?: string;
  category?: string;
  proficiency?: string;
  percentage?: number;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}