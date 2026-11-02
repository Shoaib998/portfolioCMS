import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import blogService from "./blog.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createBlog = async (
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

    const blog = await blogService.createBlog(
      user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error: any) {
    console.error(error);

    // Duplicate slug
    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists",
      });
    }

    // Author/User not found
    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};

export const getBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const blogs = await blogService.getBlogs();

    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

export const getPublishedBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const blogs =
      await blogService.getPublishedBlogs();

    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch published blogs",
    });
  }
};

export const getBlogById = async (
  req: Request,
  res: Response
) => {
  try {
    const blog =
      await blogService.getBlogById(
        String(req.params.id)
      );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

export const getBlogBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const blog =
      await blogService.getBlogBySlug(
        String(req.params.slug)
      );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

export const updateBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const blogId = String(req.params.id);

    const existingBlog =
      await blogService.getBlogById(blogId);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blog =
      await blogService.updateBlog(
        blogId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error: any) {
    console.error(error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists",
      });
    }

    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const blogId = String(req.params.id);

    const existingBlog =
      await blogService.getBlogById(blogId);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await blogService.deleteBlog(blogId);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};

export const updateBlogImage = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }

    const blogId = String(req.params.id);

    const existingBlog =
      await blogService.getBlogById(blogId);

    if (!existingBlog) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const imagePath =
      `/uploads/blogs/${req.file.filename}`;

    // Delete old image
    if (existingBlog.featuredImage) {
      const oldImagePath = path.join(
        process.cwd(),
        existingBlog.featuredImage.replace(
          /^\/uploads/,
          "uploads"
        )
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const blog =
      await blogService.updateBlogImage(
        blogId,
        imagePath
      );

    return res.status(200).json({
      success: true,
      message: "Blog image uploaded successfully",
      data: blog,
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
      message: "Failed to upload blog image",
    });
  }
};