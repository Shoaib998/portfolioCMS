import { Router } from "express";

import {
  getProfile,
  updateProfile,
  updateProfileImage,
  updateResume,
} from "./profile.controller";

import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "./profile.validation";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

import {
  upload,
  resumeUpload,
} from "../../middlewares/upload.middleware";

const router = Router();

// ====================
// Public
// ====================

router.get("/", getProfile);

// ====================
// Admin Protected
// ====================

// Update profile
router.put(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validate(updateProfileSchema),
  updateProfile
);

// Profile image upload
router.patch(
  "/image",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("profileImage"),
  updateProfileImage
);

// Resume upload
router.patch(
  "/resume",
  authMiddleware,
  roleMiddleware("admin"),
  resumeUpload.single("resume"),
  updateResume
);

export default router;