import { Router } from "express";

import { getDashboard } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

// ====================
// Protected Admin Dashboard
// ====================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getDashboard
);

export default router;