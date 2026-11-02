import { z } from "zod";

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  excerpt: z
    .string()
    .optional(),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),

  status: z
    .enum(["draft", "published"])
    .optional(),

  publishedAt: z
    .string()
    .datetime()
    .optional(),
});

export const updateBlogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .optional(),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    )
    .optional(),

  excerpt: z
    .string()
    .optional(),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .optional(),

  status: z
    .enum(["draft", "published"])
    .optional(),

  publishedAt: z
    .string()
    .datetime()
    .optional(),
});