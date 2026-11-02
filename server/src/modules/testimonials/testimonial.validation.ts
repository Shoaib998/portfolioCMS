import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  designation: z
    .string()
    .optional(),

  company: z
    .string()
    .optional(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters"),

  avatar: z
    .string()
    .optional(),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5")
    .optional(),

  sortOrder: z
    .number()
    .int()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const updateTestimonialSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .optional(),

  designation: z
    .string()
    .optional(),

  company: z
    .string()
    .optional(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .optional(),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5")
    .optional(),

  sortOrder: z
    .number()
    .int()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});