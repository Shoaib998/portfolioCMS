import { Router } from "express";
import { upload } from "../../middlewares/upload.middleware";

import {
  createBlog,
  getBlogs,
  getPublishedBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  updateBlogImage,
} from "./blog.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  createBlogSchema,
  updateBlogSchema,
} from "./blog.validation";

const router = Router();

// ====================
// Public Routes
// ====================

router.get("/", getBlogs);

router.get("/published", getPublishedBlogs);

router.get("/slug/:slug", getBlogBySlug);

router.get("/:id", getBlogById);

// ====================
// Admin Protected Routes
// ====================

// Create blog
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validate(createBlogSchema),
  createBlog
);

// Blog image
router.patch(
  "/:id/image",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("blogImage"),
  updateBlogImage
);

// Update blog
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validate(updateBlogSchema),
  updateBlog
);

// Delete blog
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteBlog
);

export default router;