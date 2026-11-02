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
import { roleMiddleware } from "../../middlewares/role.middleware";
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

router.get("/", getGallery);

router.get("/active", getActiveGallery);

router.get("/slug/:slug", getGalleryBySlug);

router.get("/:id", getGalleryById);

// ====================
// Admin Protected Routes
// ====================

// Create gallery item
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validate(createGallerySchema),
  createGallery
);

// Update gallery image
router.patch(
  "/:id/image",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("galleryImage"),
  updateGalleryImage
);

// Update gallery item
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validate(updateGallerySchema),
  updateGallery
);

// Delete gallery item
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteGallery
);

export default router;