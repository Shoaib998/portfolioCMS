import { Router } from "express";

import {
  getSettings,
  updateSettings,
  updateLogo,
  updateFavicon,
  updateResume,
  deleteResume,
} from "./settings.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  upload,
  resumeUpload,
} from "../../middlewares/upload.middleware";

import { updateSettingsSchema } from "./settings.validation";

const router = Router();

// ====================
// Public Routes
// ====================

// Get website settings
router.get("/", getSettings);

// ====================
// Protected Routes
// ====================

// Update website settings
router.put(
  "/",
  authMiddleware,
  validate(updateSettingsSchema),
  updateSettings
);

// Upload logo
router.patch(
  "/logo",
  authMiddleware,
  upload.single("logo"),
  updateLogo
);

// Upload favicon
router.patch(
  "/favicon",
  authMiddleware,
  upload.single("favicon"),
  updateFavicon
);

// Upload resume
router.patch(
  "/resume",
  authMiddleware,
  resumeUpload.single("resume"),
  updateResume
);

// Delete resume
router.delete(
  "/resume",
  authMiddleware,
  deleteResume
);

export default router;