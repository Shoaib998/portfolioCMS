import { Request, Response } from "express";
import { loginUser } from "./auth.service";
import { loginSchema } from "./auth.validation";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const payload = loginSchema.parse(req.body);

    const result = await loginUser(payload);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};

export const me = async (
  req: AuthRequest,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};