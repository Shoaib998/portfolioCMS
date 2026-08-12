import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import galleryService from "./gallery.service";

export const createGallery = async (
  req: Request,
  res: Response
) => {
  try {
    const gallery = await galleryService.createGallery(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: gallery,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create gallery item",
    });
  }
};

export const getGallery = async (
  req: Request,
  res: Response
) => {
  try {
    const gallery = await galleryService.getGallery();

    return res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery",
    });
  }
};

export const getActiveGallery = async (
  req: Request,
  res: Response
) => {
  try {
    const gallery =
      await galleryService.getActiveGallery();

    return res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active gallery",
    });
  }
};

export const getGalleryById = async (
  req: Request,
  res: Response
) => {
  try {
    const galleryId = String(req.params.id);

    const gallery =
      await galleryService.getGalleryById(galleryId);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery item",
    });
  }
};

export const getGalleryBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = String(req.params.slug);

    const gallery =
      await galleryService.getGalleryBySlug(slug);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery item",
    });
  }
};

export const updateGallery = async (
  req: Request,
  res: Response
) => {
  try {
    const galleryId = String(req.params.id);

    const existingGallery =
      await galleryService.getGalleryById(
        galleryId
      );

    if (!existingGallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    const gallery =
      await galleryService.updateGallery(
        galleryId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: gallery,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update gallery item",
    });
  }
};

export const updateGalleryImage = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Gallery image is required",
      });
    }

    const galleryId = String(req.params.id);

    const existingGallery =
      await galleryService.getGalleryById(
        galleryId
      );

    if (!existingGallery) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    const imagePath =
      `/uploads/gallery/${req.file.filename}`;

    // Delete old image
    if (existingGallery.image) {
      const oldImagePath = path.join(
        process.cwd(),
        existingGallery.image.replace(
          /^\/uploads/,
          "uploads"
        )
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const gallery =
      await galleryService.updateGalleryImage(
        galleryId,
        imagePath
      );

    return res.status(200).json({
      success: true,
      message: "Gallery image uploaded successfully",
      data: gallery,
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
      message: "Failed to upload gallery image",
    });
  }
};

export const deleteGallery = async (
  req: Request,
  res: Response
) => {
  try {
    const galleryId = String(req.params.id);

    const existingGallery =
      await galleryService.getGalleryById(
        galleryId
      );

    if (!existingGallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // Delete image from filesystem
    if (existingGallery.image) {
      const imagePath = path.join(
        process.cwd(),
        existingGallery.image.replace(
          /^\/uploads/,
          "uploads"
        )
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await galleryService.deleteGallery(
      galleryId
    );

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
    });
  }
};