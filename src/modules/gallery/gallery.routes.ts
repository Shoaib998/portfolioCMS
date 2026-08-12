import { Router } from "express";

import {
  createGallery,
  getGallery,
  getActiveGallery,
  getGalleryById,
  getGalleryBySlug,
  updateGallery,
  updateGalleryImage,
  deleteGallery,
} from "./gallery.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  createGallerySchema,
  updateGallerySchema,
} from "./gallery.validation";

import { upload } from "../../middlewares/upload.middleware";

const router = Router();

// ====================
// Public Routes
// ====================

// Get all gallery items
router.get("/", getGallery);

// Get active gallery items
router.get("/active", getActiveGallery);

// Get gallery item by slug
router.get("/slug/:slug", getGalleryBySlug);

// Get gallery item by ID
router.get("/:id", getGalleryById);

// ====================
// Protected Routes
// ====================

// Create gallery item
router.post(
  "/",
  authMiddleware,
  validate(createGallerySchema),
  createGallery
);

// Update gallery image
router.patch(
  "/:id/image",
  authMiddleware,
  upload.single("galleryImage"),
  updateGalleryImage
);

// Update gallery item
router.put(
  "/:id",
  authMiddleware,
  validate(updateGallerySchema),
  updateGallery
);

// Delete gallery item
router.delete(
  "/:id",
  authMiddleware,
  deleteGallery
);

export default router;