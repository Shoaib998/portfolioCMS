import { Request, Response } from "express";
import projectService from "./project.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import fs from "fs";
import path from "path";

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await projectService.createProject(req.body);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

export const getProjects = async (
  req: Request,
  res: Response
) => {
  try {
    const projects = await projectService.getProjects();

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

export const getProjectById = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await projectService.getProjectById(
      String(req.params.id)
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await projectService.updateProject(
      String(req.params.id),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
) => {
  try {
    await projectService.deleteProject(
  String(req.params.id)
  );

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

export const updateProjectImage = async (
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
        message: "Project image is required",
      });
    }

    const projectId = String(req.params.id);

    // Find existing project first
    const existingProject =
      await projectService.getProjectById(projectId);

    if (!existingProject) {
      // Delete newly uploaded file because project doesn't exist
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // New image path
    const imagePath =
      `/uploads/projects/${req.file.filename}`;

    // Delete old image if it exists
    if (existingProject.projectImage) {
      const oldImagePath = path.join(
        process.cwd(),
        existingProject.projectImage.replace(
          /^\/uploads/,
          "uploads"
        )
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update database
    const project =
      await projectService.updateProjectImage(
        projectId,
        imagePath
      );

    return res.status(200).json({
      success: true,
      message: "Project image uploaded successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);

    // Cleanup newly uploaded file if something fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload project image",
    });
  }
};