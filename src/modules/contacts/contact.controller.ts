import { Request, Response } from "express";
import contactService from "./contact.service";

export const createContact = async (
  req: Request,
  res: Response
) => {
  try {
    const contact = await contactService.createContact(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

export const getContacts = async (
  req: Request,
  res: Response
) => {
  try {
    const contacts = await contactService.getContacts();

    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
    });
  }
};

export const getContactById = async (
  req: Request,
  res: Response
) => {
  try {
    const contactId = String(req.params.id);

    const contact =
      await contactService.getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact message",
    });
  }
};

export const updateContact = async (
  req: Request,
  res: Response
) => {
  try {
    const contactId = String(req.params.id);

    const existingContact =
      await contactService.getContactById(contactId);

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    const contact =
      await contactService.updateContact(
        contactId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update contact message",
    });
  }
};

export const deleteContact = async (
  req: Request,
  res: Response
) => {
  try {
    const contactId = String(req.params.id);

    const existingContact =
      await contactService.getContactById(contactId);

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    await contactService.deleteContact(contactId);

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact message",
    });
  }
};