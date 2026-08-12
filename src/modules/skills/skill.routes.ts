import { Router } from "express";

import {
  createSkill,
  getSkills,
  getActiveSkills,
  getSkillById,
  getSkillBySlug,
  updateSkill,
  deleteSkill,
} from "./skill.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  createSkillSchema,
  updateSkillSchema,
} from "./skill.validation";

const router = Router();

// ====================
// Public Routes
// ====================

// Get all skills
router.get("/", getSkills);

// Get active skills
router.get("/active", getActiveSkills);

// Get skill by slug
router.get("/slug/:slug", getSkillBySlug);

// Get skill by ID
router.get("/:id", getSkillById);

// ====================
// Protected Routes
// ====================

// Create skill
router.post(
  "/",
  authMiddleware,
  validate(createSkillSchema),
  createSkill
);

// Update skill
router.put(
  "/:id",
  authMiddleware,
  validate(updateSkillSchema),
  updateSkill
);

// Delete skill
router.delete(
  "/:id",
  authMiddleware,
  deleteSkill
);

export default router;