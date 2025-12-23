import { Router } from "express";
import { pickupController } from "@/controllers/pickup.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/role.middleware";
import { validate } from "@/middleware/validation.middleware";
import {
  createPickupSchema,
  updatePickupSchema,
  getPickupsSchema,
  acceptPickupSchema,
  startPickupSchema,
  weighPickupSchema,
  completePickupSchema,
} from "@/validators/pickup.validator";
import { UserRole } from "@prisma/client";

const router = Router();

// Customer routes
router.post(
  "/",
  authenticate,
  validate(createPickupSchema),
  pickupController.createPickup
);

router.get(
  "/",
  authenticate,
  validate(getPickupsSchema),
  pickupController.getPickups
);

router.get("/:id", authenticate, pickupController.getPickupById);
router.put(
  "/:id",
  authenticate,
  validate(updatePickupSchema),
  pickupController.updatePickup
);

// Collector routes
router.get(
  "/collector/available",
  authenticate,
  requireRole(UserRole.COLLECTOR),
  pickupController.getAvailablePickups
);

router.post(
  "/collector/:id/accept",
  authenticate,
  requireRole(UserRole.COLLECTOR),
  validate(acceptPickupSchema),
  pickupController.acceptPickup
);

router.post(
  "/collector/:id/start",
  authenticate,
  requireRole(UserRole.COLLECTOR),
  validate(startPickupSchema),
  pickupController.startPickup
);

router.post(
  "/collector/:id/weigh",
  authenticate,
  requireRole(UserRole.COLLECTOR),
  validate(weighPickupSchema),
  pickupController.weighPickup
);

router.post(
  "/collector/:id/complete",
  authenticate,
  requireRole(UserRole.COLLECTOR),
  validate(completePickupSchema),
  pickupController.completePickup
);

export default router;

