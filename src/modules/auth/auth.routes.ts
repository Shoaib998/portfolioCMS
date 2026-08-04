import { Router } from "express";
import { login } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { me } from "./auth.controller";

const router = Router();

router.post("/login", login);

router.get("/me", authMiddleware, me);

export default router;