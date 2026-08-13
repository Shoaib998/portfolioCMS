import { Router } from "express";

import {
  createTestimonial,
  getTestimonials,
  getActiveTestimonials,
  getTestimonialById,
  updateTestimonial,
  updateTestimonialAvatar,
  deleteTestimonial,
} from "./testimonial.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./testimonial.validation";

import { upload } from "../../middlewares/upload.middleware";

const router = Router();

// ====================
// Public Routes
// ====================

// Get all testimonials
router.get("/", getTestimonials);

// Get active testimonials
router.get("/active", getActiveTestimonials);

// Get testimonial by ID
router.get("/:id", getTestimonialById);

// ====================
// Protected Routes
// ====================

// Create testimonial
router.post(
  "/",
  authMiddleware,
  validate(createTestimonialSchema),
  createTestimonial
);

// Update testimonial avatar
router.patch(
  "/:id/avatar",
  authMiddleware,
  upload.single("testimonialAvatar"),
  updateTestimonialAvatar
);

// Update testimonial
router.put(
  "/:id",
  authMiddleware,
  validate(updateTestimonialSchema),
  updateTestimonial
);

// Delete testimonial
router.delete(
  "/:id",
  authMiddleware,
  deleteTestimonial
);

export default router;