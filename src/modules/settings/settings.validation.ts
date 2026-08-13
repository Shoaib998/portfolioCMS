import { z } from "zod";

export const updateSettingsSchema = z.object({
  siteName: z
    .string()
    .optional(),

  siteTitle: z
    .string()
    .optional(),

  siteDescription: z
    .string()
    .optional(),

  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .optional(),

  address: z
    .string()
    .optional(),

  facebook: z
    .string()
    .url("Invalid Facebook URL")
    .optional()
    .or(z.literal("")),

  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .optional()
    .or(z.literal("")),

  linkedin: z
    .string()
    .url("Invalid LinkedIn URL")
    .optional()
    .or(z.literal("")),

  github: z
    .string()
    .url("Invalid GitHub URL")
    .optional()
    .or(z.literal("")),

  twitter: z
    .string()
    .url("Invalid Twitter/X URL")
    .optional()
    .or(z.literal("")),

  primaryColor: z
    .string()
    .optional(),

  secondaryColor: z
    .string()
    .optional(),

  maintenanceMode: z
    .boolean()
    .optional(),
});