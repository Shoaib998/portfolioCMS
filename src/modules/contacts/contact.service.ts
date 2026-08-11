import prisma from "../../config/prisma";
import {
  CreateContactDto,
  UpdateContactDto,
} from "./contact.types";

export class ContactService {
  // Create new contact message
  async createContact(data: CreateContactDto) {
    return prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });
  }

  // Get all contact messages
  async getContacts() {
    return prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Get single contact message
  async getContactById(id: string) {
    return prisma.contact.findUnique({
      where: {
        id,
      },
    });
  }

  // Update contact status
  async updateContact(
    id: string,
    data: UpdateContactDto
  ) {
    return prisma.contact.update({
      where: {
        id,
      },
      data: {
        status: data.status,
      },
    });
  }

  // Delete contact message
  async deleteContact(id: string) {
    return prisma.contact.delete({
      where: {
        id,
      },
    });
  }
}

export default new ContactService();