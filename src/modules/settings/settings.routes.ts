import { Router } from "express";

import {
  getSettings,
  updateSettings,
  updateLogo,
  updateFavicon,
} from "./settings.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import { updateSettingsSchema } from "./settings.validation";

import { upload } from "../../middlewares/upload.middleware";

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

export default router;