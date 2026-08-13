import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import settingsService from "./settings.service";

export const getSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const settings =
      await settingsService.getSettings();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

export const updateSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const settings =
      await settingsService.updateSettings(
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

export const updateLogo = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Logo image is required",
      });
    }

    const settings =
      await settingsService.getSettings();

    const imagePath =
      `/uploads/settings/${req.file.filename}`;

    // Delete old logo
    if (settings.logo) {
      const oldLogoPath = path.join(
        process.cwd(),
        settings.logo.replace(
          /^\/uploads/,
          "uploads"
        )
      );

      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    const updatedSettings =
      await settingsService.updateLogo(
        settings.id,
        imagePath
      );

    return res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      data: updatedSettings,
    });
  } catch (error) {
    console.error(error);

    if (
      req.file &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload logo",
    });
  }
};

export const updateFavicon = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Favicon image is required",
      });
    }

    const settings =
      await settingsService.getSettings();

    const imagePath =
      `/uploads/settings/${req.file.filename}`;

    // Delete old favicon
    if (settings.favicon) {
      const oldFaviconPath = path.join(
        process.cwd(),
        settings.favicon.replace(
          /^\/uploads/,
          "uploads"
        )
      );

      if (fs.existsSync(oldFaviconPath)) {
        fs.unlinkSync(oldFaviconPath);
      }
    }

    const updatedSettings =
      await settingsService.updateFavicon(
        settings.id,
        imagePath
      );

    return res.status(200).json({
      success: true,
      message: "Favicon uploaded successfully",
      data: updatedSettings,
    });
  } catch (error) {
    console.error(error);

    if (
      req.file &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload favicon",
    });
  }
};