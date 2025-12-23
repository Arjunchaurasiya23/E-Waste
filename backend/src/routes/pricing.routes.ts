import { Router } from "express";
import { pricingController } from "@/controllers/pricing.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/role.middleware";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

// Public route - get all pricing
router.get("/", pricingController.getAllPricing);

// Admin route - update pricing
const updatePricingSchema = z.object({
  params: z.object({
    type: z.enum(["PAPER", "PLASTIC", "METAL", "EWASTE", "GLASS", "MIXED"]),
  }),
  body: z.object({
    pricePerKg: z.number().positive().optional(),
    minQuantity: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  }),
});

router.put(
  "/:type",
  authenticate,
  requireRole(UserRole.ADMIN),
  validate(updatePricingSchema),
  pricingController.updatePricing
);

export default router;

