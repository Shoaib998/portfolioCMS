import prisma from "../../config/prisma";
import {
  CreateServiceDto,
  UpdateServiceDto,
} from "./service.types";

export class ServiceService {
  // Create service
  async createService(data: CreateServiceDto) {
    return prisma.service.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        icon: data.icon,
        featured: data.featured ?? false,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Get all services
  async getServices() {
    return prisma.service.findMany({
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

  // Get active services
  async getActiveServices() {
    return prisma.service.findMany({
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

  // Get service by ID
  async getServiceById(id: string) {
    return prisma.service.findUnique({
      where: {
        id,
      },
    });
  }

  // Get service by slug
  async getServiceBySlug(slug: string) {
    return prisma.service.findUnique({
      where: {
        slug,
      },
    });
  }

  // Update service
  async updateService(
    id: string,
    data: UpdateServiceDto
  ) {
    return prisma.service.update({
      where: {
        id,
      },
      data,
    });
  }

  // Delete service
  async deleteService(id: string) {
    return prisma.service.delete({
      where: {
        id,
      },
    });
  }
}

export default new ServiceService();