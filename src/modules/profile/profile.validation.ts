import { z } from "zod";

export const updateProfileSchema = z.object({
  headline: z
    .string()
    .min(3, "Headline must be at least 3 characters")
    .max(100)
    .optional(),

  designation: z
    .string()
    .max(100)
    .optional(),

  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters")
    .max(2000)
    .optional(),

  phone: z
    .string()
    .min(10)
    .max(20)
    .optional(),

  alternatePhone: z
    .string()
    .min(10)
    .max(20)
    .optional(),

  website: z
    .url("Invalid website URL")
    .optional(),

  location: z
    .string()
    .max(100)
    .optional(),

  country: z
    .string()
    .max(100)
    .optional(),

  github: z
    .url("Invalid GitHub URL")
    .optional(),

  linkedin: z
    .url("Invalid LinkedIn URL")
    .optional(),

  facebook: z
    .url("Invalid Facebook URL")
    .optional(),

  instagram: z
    .url("Invalid Instagram URL")
    .optional(),

  twitter: z
    .url("Invalid Twitter URL")
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;