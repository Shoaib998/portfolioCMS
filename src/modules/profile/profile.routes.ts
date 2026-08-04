import { Router } from "express";
import {
  getProfile,
  updateProfile,
} from "./profile.controller";

import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "./profile.validation";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/", getProfile);

// Admin
router.put(
  "/",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile
);

export default router;