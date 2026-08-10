import prisma from "../../config/prisma";
import {
  CreateProjectDto,
  UpdateProjectDto,
} from "./project.types";

export class ProjectService {
  async createProject(data: CreateProjectDto) {
    return prisma.project.create({
      data,
    });
  }

  async getProjects() {
    return prisma.project.findMany({
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

  async getProjectById(id: string) {
    return prisma.project.findUnique({
      where: {
        id,
      },
    });
  }

  async updateProject(
    id: string,
    data: UpdateProjectDto
  ) {
    return prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteProject(id: string) {
    return prisma.project.delete({
      where: {
        id,
      },
    });
  }

 async updateProjectImage(
  projectId: string,
  imagePath: string
) {
  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      projectImage: imagePath,
    },
  });
}
}

export default new ProjectService();