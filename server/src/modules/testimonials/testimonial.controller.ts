import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import testimonialService from "./testimonial.service";

export const createTestimonial = async (
  req: Request,
  res: Response
) => {
  try {
    const testimonial =
      await testimonialService.createTestimonial(req.body);

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create testimonial",
    });
  }
};

export const getTestimonials = async (
  req: Request,
  res: Response
) => {
  try {
    const testimonials =
      await testimonialService.getTestimonials();

    return res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
    });
  }
};

export const getActiveTestimonials = async (
  req: Request,
  res: Response
) => {
  try {
    const testimonials =
      await testimonialService.getActiveTestimonials();

    return res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active testimonials",
    });
  }
};

export const getTestimonialById = async (
  req: Request,
  res: Response
) => {
  try {
    const testimonialId = String(req.params.id);

    const testimonial =
      await testimonialService.getTestimonialById(
        testimonialId
      );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial",
    });
  }
};

export const updateTestimonial = async (
  req: Request,
  res: Response
) => {
  try {
    const testimonialId = String(req.params.id);

    const existingTestimonial =
      await testimonialService.getTestimonialById(
        testimonialId
      );

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const testimonial =
      await testimonialService.updateTestimonial(
        testimonialId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
    });
  }
};

export const updateTestimonialAvatar = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Testimonial avatar is required",
      });
    }

    const testimonialId = String(req.params.id);

    const existingTestimonial =
      await testimonialService.getTestimonialById(
        testimonialId
      );

    if (!existingTestimonial) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const avatarPath =
      `/uploads/testimonials/${req.file.filename}`;

    // Delete old avatar
    if (existingTestimonial.avatar) {
      const oldAvatarPath = path.join(
        process.cwd(),
        existingTestimonial.avatar.replace(
          /^\/uploads/,
          "uploads"
        )
      );

      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    const testimonial =
      await testimonialService.updateTestimonialAvatar(
        testimonialId,
        avatarPath
      );

    return res.status(200).json({
      success: true,
      message: "Testimonial avatar uploaded successfully",
      data: testimonial,
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
      message: "Failed to upload testimonial avatar",
    });
  }
};

export const deleteTestimonial = async (
  req: Request,
  res: Response
) => {
  try {
    const testimonialId = String(req.params.id);

    const existingTestimonial =
      await testimonialService.getTestimonialById(
        testimonialId
      );

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Delete avatar from filesystem
    if (existingTestimonial.avatar) {
      const avatarPath = path.join(
        process.cwd(),
        existingTestimonial.avatar.replace(
          /^\/uploads/,
          "uploads"
        )
      );

      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    await testimonialService.deleteTestimonial(
      testimonialId
    );

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
    });
  }
};