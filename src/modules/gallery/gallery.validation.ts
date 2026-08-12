import { z } from "zod";

export const createGallerySchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters"),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .optional(),

  image: z
    .string()
    .min(1, "Image is required"),

  category: z
    .string()
    .optional(),

  sortOrder: z
    .number()
    .int()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const updateGallerySchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .optional(),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    )
    .optional(),

  description: z
    .string()
    .optional(),

  category: z
    .string()
    .optional(),

  sortOrder: z
    .number()
    .int()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});