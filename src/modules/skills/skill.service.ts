import prisma from "../../config/prisma";
import {
  CreateSkillDto,
  UpdateSkillDto,
} from "./skill.types";

export class SkillService {
  // Create Skill
  async createSkill(data: CreateSkillDto) {
    return prisma.skill.create({
      data: {
        name: data.name,
        slug: data.slug,
        category: data.category,
        proficiency: data.proficiency,
        percentage: data.percentage,
        icon: data.icon,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Get all skills
  async getSkills() {
    return prisma.skill.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }

  // Get active skills
  async getActiveSkills() {
    return prisma.skill.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }

  // Get skill by ID
  async getSkillById(id: string) {
    return prisma.skill.findUnique({
      where: {
        id,
      },
    });
  }

  // Get skill by slug
  async getSkillBySlug(slug: string) {
    return prisma.skill.findUnique({
      where: {
        slug,
      },
    });
  }

  // Update skill
  async updateSkill(
    id: string,
    data: UpdateSkillDto
  ) {
    return prisma.skill.update({
      where: {
        id,
      },
      data,
    });
  }

  // Delete skill
  async deleteSkill(id: string) {
    return prisma.skill.delete({
      where: {
        id,
      },
    });
  }
}

export default new SkillService();