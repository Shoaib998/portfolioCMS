import prisma from "../../config/prisma";
import { UpdateProfileDto } from "./profile.types";

export class ProfileService {
  async getProfile() {
    return prisma.profile.findFirst({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return prisma.profile.upsert({
      where: {
        userId,
      },

      update: data,

      create: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },

      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
  }
}

export default new ProfileService();