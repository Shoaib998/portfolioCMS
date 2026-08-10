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
import {
  upload,
  resumeUpload,
} from "../../middlewares/upload.middleware";

const router = Router();

// Public
router.get("/", getProfile);

// Protected
router.put(
  "/",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile
);

// Profile Image Upload
router.patch(
  "/image",
  authMiddleware,
  upload.single("profileImage"),
  updateProfileImage
);

// Resume Upload
router.patch(
  "/resume",
  authMiddleware,
  resumeUpload.single("resume"),
  updateResume
);

export default router;