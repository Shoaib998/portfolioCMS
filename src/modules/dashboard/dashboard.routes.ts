import { Router } from "express";

import { getDashboard } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// ====================
// Protected Dashboard
// ====================

router.get(
  "/",
  authMiddleware,
  getDashboard
);

export default router;