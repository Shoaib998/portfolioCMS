import { Request, Response } from "express";
import { loginUser } from "./auth.service";
import { loginSchema } from "./auth.validation";
import { AuthRequest } from "../../middleware/auth.middleware";

export const login = async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.parse(req.body);

    const result = await loginUser(payload);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};