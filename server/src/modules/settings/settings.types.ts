export interface UpdateSettingsDto {
  siteName?: string;
  siteTitle?: string;
  siteDescription?: string;

  email?: string;
  phone?: string;
  address?: string;

  logo?: string;
  favicon?: string;

  facebook?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;

  resume?: string;

  primaryColor?: string;
  secondaryColor?: string;

  maintenanceMode?: boolean;
}