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
import { validate } from "../../middlewares/validate.middleware";

import {
  createBlogSchema,
  updateBlogSchema,
} from "./blog.validation";

const router = Router();

// ====================
// Public Routes
// ====================

// Get all blogs
router.get("/", getBlogs);

// Get published blogs
router.get("/published", getPublishedBlogs);

// Get blog by slug
router.get("/slug/:slug", getBlogBySlug);

// Get blog by ID
router.get("/:id", getBlogById);

// ====================
// Protected Routes
// ====================

// Create blog
router.post(
  "/",
  authMiddleware,
  validate(createBlogSchema),
  createBlog
);

//blog image
router.patch(
  "/:id/image",
  authMiddleware,
  upload.single("blogImage"),
  updateBlogImage
);

// Update blog
router.put(
  "/:id",
  authMiddleware,
  validate(updateBlogSchema),
  updateBlog
);

// Delete blog
router.delete(
  "/:id",
  authMiddleware,
  deleteBlog
);



export default router;