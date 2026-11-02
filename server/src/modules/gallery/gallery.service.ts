import prisma from "../../config/prisma";
import {
  CreateGalleryDto,
  UpdateGalleryDto,
} from "./gallery.types";

export class GalleryService {
  // Create Gallery Item
  async createGallery(data: CreateGalleryDto) {
    return prisma.gallery.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: data.image,
        category: data.category,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Get all Gallery Items
  async getGallery() {
    return prisma.gallery.findMany({
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

  // Get active Gallery Items
  async getActiveGallery() {
    return prisma.gallery.findMany({
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

  // Get Gallery Item by ID
  async getGalleryById(id: string) {
    return prisma.gallery.findUnique({
      where: {
        id,
      },
    });
  }

  // Get Gallery Item by Slug
  async getGalleryBySlug(slug: string) {
    return prisma.gallery.findUnique({
      where: {
        slug,
      },
    });
  }

  // Update Gallery Item
  async updateGallery(
    id: string,
    data: UpdateGalleryDto
  ) {
    return prisma.gallery.update({
      where: {
        id,
      },
      data,
    });
  }

  // Update Gallery Image
  async updateGalleryImage(
    id: string,
    imagePath: string
  ) {
    return prisma.gallery.update({
      where: {
        id,
      },
      data: {
        image: imagePath,
      },
    });
  }

  // Delete Gallery Item
  async deleteGallery(id: string) {
    return prisma.gallery.delete({
      where: {
        id,
      },
    });
  }
}

export default new GalleryService();