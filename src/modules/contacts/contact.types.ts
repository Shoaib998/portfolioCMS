export interface CreateContactDto {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface UpdateContactDto {
  status?: "new" | "read" | "replied" | "archived";
}