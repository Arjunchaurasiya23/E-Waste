import { Router } from "express";
import { collectorController } from "@/controllers/collector.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/role.middleware";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

const getAllCollectorsSchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "APPROVED", "SUSPENDED"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

const updateCollectorStatusSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "SUSPENDED"]),
  }),
});

// Admin routes
router.get(
  "/",
  authenticate,
  requireRole(UserRole.ADMIN),
  validate(getAllCollectorsSchema),
  collectorController.getAllCollectors
);

router.get(
  "/:id",
  authenticate,
  requireRole(UserRole.ADMIN),
  collectorController.getCollectorById
);

router.put(
  "/:id/status",
  authenticate,
  requireRole(UserRole.ADMIN),
  validate(updateCollectorStatusSchema),
  collectorController.updateCollectorStatus
);

// Collector routes
router.get(
  "/me",
  authenticate,
  requireRole(UserRole.COLLECTOR),
  collectorController.getMyProfile
);

router.get(
  "/me/earnings",
  authenticate,
  requireRole(UserRole.COLLECTOR),
  collectorController.getEarnings
);

export default router;

