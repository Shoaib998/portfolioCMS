import { z } from "zod";

export const createSkillSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must be at least 2 characters"),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  category: z
    .string()
    .optional(),

  proficiency: z
    .string()
    .optional(),

  percentage: z
    .number()
    .int()
    .min(0, "Percentage cannot be less than 0")
    .max(100, "Percentage cannot be greater than 100")
    .optional(),

  icon: z
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

export const updateSkillSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must be at least 2 characters")
    .optional(),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    )
    .optional(),

  category: z
    .string()
    .optional(),

  proficiency: z
    .string()
    .optional(),

  percentage: z
    .number()
    .int()
    .min(0, "Percentage cannot be less than 0")
    .max(100, "Percentage cannot be greater than 100")
    .optional(),

  icon: z
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