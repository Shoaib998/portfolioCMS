import { Request, Response } from "express";
import skillService from "./skill.service";

export const createSkill = async (
  req: Request,
  res: Response
) => {
  try {
    const skill = await skillService.createSkill(req.body);

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create skill",
    });
  }
};

export const getSkills = async (
  req: Request,
  res: Response
) => {
  try {
    const skills = await skillService.getSkills();

    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

export const getActiveSkills = async (
  req: Request,
  res: Response
) => {
  try {
    const skills = await skillService.getActiveSkills();

    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active skills",
    });
  }
};

export const getSkillById = async (
  req: Request,
  res: Response
) => {
  try {
    const skillId = String(req.params.id);

    const skill = await skillService.getSkillById(skillId);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
    });
  }
};

export const getSkillBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = String(req.params.slug);

    const skill = await skillService.getSkillBySlug(slug);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
    });
  }
};

export const updateSkill = async (
  req: Request,
  res: Response
) => {
  try {
    const skillId = String(req.params.id);

    const existingSkill =
      await skillService.getSkillById(skillId);

    if (!existingSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    const skill = await skillService.updateSkill(
      skillId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update skill",
    });
  }
};

export const deleteSkill = async (
  req: Request,
  res: Response
) => {
  try {
    const skillId = String(req.params.id);

    const existingSkill =
      await skillService.getSkillById(skillId);

    if (!existingSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await skillService.deleteSkill(skillId);

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};