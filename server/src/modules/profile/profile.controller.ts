import { Request, Response } from "express";
import profileService from "./profile.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getProfile();

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const profile = await profileService.updateProfile(
      user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const updateProfileImage = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const imagePath = `/uploads/profiles/${req.file.filename}`;

    const profile = await profileService.updateProfileImage(
      user.id,
      imagePath
    );

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
    });
  }
};

export const updateResume = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    const resumePath = `/uploads/resumes/${req.file.filename}`;

    const profile = await profileService.updateResume(
      user.id,
      resumePath
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};