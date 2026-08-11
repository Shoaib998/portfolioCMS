import { Router } from "express";

import {
  createService,
  getServices,
  getActiveServices,
  getServiceById,
  getServiceBySlug,
  updateService,
  deleteService,
} from "./service.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  createServiceSchema,
  updateServiceSchema,
} from "./service.validation";

const router = Router();

// ====================
// Public Routes
// ====================

// Get all services
router.get("/", getServices);

// Get active services
router.get("/active", getActiveServices);

// Get service by slug
router.get("/slug/:slug", getServiceBySlug);

// Get service by ID
router.get("/:id", getServiceById);

// ====================
// Protected Routes
// ====================

// Create service
router.post(
  "/",
  authMiddleware,
  validate(createServiceSchema),
  createService
);

// Update service
router.put(
  "/:id",
  authMiddleware,
  validate(updateServiceSchema),
  updateService
);

// Delete service
router.delete(
  "/:id",
  authMiddleware,
  deleteService
);

export default router;