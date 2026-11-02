import { z } from "zod";

export const createServiceSchema = z.object({
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

  shortDescription: z
    .string()
    .optional(),

  description: z
    .string()
    .optional(),

  icon: z
    .string()
    .optional(),

  featured: z
    .boolean()
    .optional(),

  sortOrder: z
    .number()
    .int()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const updateServiceSchema = z.object({
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

  shortDescription: z
    .string()
    .optional(),

  description: z
    .string()
    .optional(),

  icon: z
    .string()
    .optional(),

  featured: z
    .boolean()
    .optional(),

  sortOrder: z
    .number()
    .int()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});