import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();