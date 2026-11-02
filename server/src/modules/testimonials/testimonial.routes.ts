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
import { roleMiddleware } from "../../middlewares/role.middleware";
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

router.get("/", getTestimonials);

router.get("/active", getActiveTestimonials);

router.get("/:id", getTestimonialById);

// ====================
// Admin Protected Routes
// ====================

// Create testimonial
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validate(createTestimonialSchema),
  createTestimonial
);

// Update testimonial avatar
router.patch(
  "/:id/avatar",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("testimonialAvatar"),
  updateTestimonialAvatar
);

// Update testimonial
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validate(updateTestimonialSchema),
  updateTestimonial
);

// Delete testimonial
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteTestimonial
);

export default router;