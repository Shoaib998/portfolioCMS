import { Router } from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectImage,
} from "./project.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

import { validate } from "../../middlewares/validate.middleware";
import { upload } from "../../middlewares/upload.middleware";

import {
  createProjectSchema,
  updateProjectSchema,
} from "./project.validation";

const router = Router();

// ====================
// Public Routes
// ====================

router.get("/", getProjects);

router.get("/:id", getProjectById);

// ====================
// Admin Protected Routes
// ====================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validate(createProjectSchema),
  createProject
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validate(updateProjectSchema),
  updateProject
);

router.patch(
  "/:id/image",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("projectImage"),
  updateProjectImage
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProject
);

export default router;