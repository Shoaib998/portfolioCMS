import { Router } from "express";

import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "./contact.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

import {
  createContactSchema,
  updateContactSchema,
} from "./contact.validation";

const router = Router();

// ====================
// Public Route
// ====================

// Submit contact form
router.post(
  "/",
  validate(createContactSchema),
  createContact
);

// ====================
// Protected Admin Routes
// ====================

// Get all contact messages
router.get(
  "/",
  authMiddleware,
  getContacts
);

// Get single contact message
router.get(
  "/:id",
  authMiddleware,
  getContactById
);

// Update contact status
router.patch(
  "/:id",
  authMiddleware,
  validate(updateContactSchema),
  updateContact
);

// Delete contact message
router.delete(
  "/:id",
  authMiddleware,
  deleteContact
);

export default router;