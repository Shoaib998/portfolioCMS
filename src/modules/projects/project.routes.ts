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
import { validate } from "../../middlewares/validate.middleware";
import { upload } from "../../middlewares/upload.middleware";

import {
  createProjectSchema,
  updateProjectSchema,
} from "./project.validation";

const router = Router();

// Public
router.get("/", getProjects);

router.get("/:id", getProjectById);

// Protected
router.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  createProject
);

router.put(
  "/:id",
  authMiddleware,
  validate(updateProjectSchema),
  updateProject
);

// Project Image Upload
router.patch(
  "/:id/image",
  authMiddleware,
  upload.single("projectImage"),
  updateProjectImage
);

router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

export default router;