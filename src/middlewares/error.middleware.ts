import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  // =========================
  // Multer Errors
  // =========================
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size is too large",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected file field",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // =========================
  // Zod Errors
  // =========================
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // =========================
  // Prisma Errors
  // =========================
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
  }

  // =========================
  // Default Error
  // =========================
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};