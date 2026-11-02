import prisma from "../../config/prisma";
import { UpdateProfileDto } from "./profile.types";
import fs from "fs";
import path from "path";

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

  async updateProfileImage(userId: string, imagePath: string) {
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
      select: {
        profileImage: true,
      },
    });

    // Delete old profile image
    if (existingProfile?.profileImage) {
      const oldImagePath = path.join(
        process.cwd(),
        existingProfile.profileImage.replace(/^\/+/, "")
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    return prisma.profile.upsert({
      where: {
        userId,
      },

      update: {
        profileImage: imagePath,
      },

      create: {
        userId,
        profileImage: imagePath,
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

  async updateResume(userId: string, resumePath: string) {
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
      select: {
        resume: true,
      },
    });

    // Delete old resume
    if (existingProfile?.resume) {
      const oldResumePath = path.join(
        process.cwd(),
        existingProfile.resume.replace(/^\/+/, "")
      );

      if (fs.existsSync(oldResumePath)) {
        fs.unlinkSync(oldResumePath);
      }
    }

    return prisma.profile.upsert({
      where: {
        userId,
      },

      update: {
        resume: resumePath,
      },

      create: {
        userId,
        resume: resumePath,
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