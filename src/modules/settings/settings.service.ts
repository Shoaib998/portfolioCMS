import prisma from "../../config/prisma";
import { UpdateSettingsDto } from "./settings.types";

export class SettingsService {
  // Get website settings
  async getSettings() {
    let settings = await prisma.settings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: {},
      });
    }

    return settings;
  }

  // Update website settings
  async updateSettings(data: UpdateSettingsDto) {
    const existingSettings =
      await prisma.settings.findFirst();

    if (!existingSettings) {
      return prisma.settings.create({
        data,
      });
    }

    return prisma.settings.update({
      where: {
        id: existingSettings.id,
      },
      data,
    });
  }

  // Update Logo
  async updateLogo(
    id: string,
    logoPath: string
  ) {
    return prisma.settings.update({
      where: {
        id,
      },
      data: {
        logo: logoPath,
      },
    });
  }

  // Update Favicon
  async updateFavicon(
    id: string,
    faviconPath: string
  ) {
    return prisma.settings.update({
      where: {
        id,
      },
      data: {
        favicon: faviconPath,
      },
    });
  }
}

export default new SettingsService();