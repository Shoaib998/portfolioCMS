import prisma from "../../config/prisma";
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from "./testimonial.types";

export class TestimonialService {
  // Create testimonial
  async createTestimonial(data: CreateTestimonialDto) {
    return prisma.testimonial.create({
      data: {
        name: data.name,
        designation: data.designation,
        company: data.company,
        message: data.message,
        avatar: data.avatar,
        rating: data.rating ?? 5,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Get all testimonials
  async getTestimonials() {
    return prisma.testimonial.findMany({
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

  // Get active testimonials
  async getActiveTestimonials() {
    return prisma.testimonial.findMany({
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

  // Get testimonial by ID
  async getTestimonialById(id: string) {
    return prisma.testimonial.findUnique({
      where: {
        id,
      },
    });
  }

  // Update testimonial
  async updateTestimonial(
    id: string,
    data: UpdateTestimonialDto
  ) {
    return prisma.testimonial.update({
      where: {
        id,
      },
      data,
    });
  }

  // Update testimonial avatar
  async updateTestimonialAvatar(
    id: string,
    avatarPath: string
  ) {
    return prisma.testimonial.update({
      where: {
        id,
      },
      data: {
        avatar: avatarPath,
      },
    });
  }

  // Delete testimonial
  async deleteTestimonial(id: string) {
    return prisma.testimonial.delete({
      where: {
        id,
      },
    });
  }
}

export default new TestimonialService();