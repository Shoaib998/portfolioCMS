import { Request, Response } from "express";
import profileService from "./profile.service";

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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

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