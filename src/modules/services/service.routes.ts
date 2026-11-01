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
import { roleMiddleware } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  createServiceSchema,
  updateServiceSchema,
} from "./service.validation";

const router = Router();

// ====================
// Public Routes
// ====================

router.get("/", getServices);

router.get("/active", getActiveServices);

router.get("/slug/:slug", getServiceBySlug);

router.get("/:id", getServiceById);

// ====================
// Admin Protected Routes
// ====================

// Create service
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validate(createServiceSchema),
  createService
);

// Update service
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validate(updateServiceSchema),
  updateService
);

// Delete service
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteService
);

export default router;