import { Router } from "express";

import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "./contact.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
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
// Admin Protected Routes
// ====================

// Get all contact messages
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getContacts
);

// Get single contact message
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getContactById
);

// Update contact status
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  validate(updateContactSchema),
  updateContact
);

// Delete contact message
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteContact
);

export default router;