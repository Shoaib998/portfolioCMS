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
import { roleMiddleware } from "../../middlewares/role.middleware";
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
  roleMiddleware("admin"),
  validate(updateSettingsSchema),
  updateSettings
);

// Upload logo
router.patch(
  "/logo",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("logo"),
  updateLogo
);

// Upload favicon
router.patch(
  "/favicon",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("favicon"),
  updateFavicon
);

// Upload resume
router.patch(
  "/resume",
  authMiddleware,
  roleMiddleware("admin"),
  resumeUpload.single("resume"),
  updateResume
);

router.delete(
  "/resume",
  authMiddleware,
  roleMiddleware("admin"),
  deleteResume
);

export default router;