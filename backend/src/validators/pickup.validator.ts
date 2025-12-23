import { z } from "zod";
import { addressSchema, idParamSchema } from "./common.validator";

// Waste bag item schema
const wasteBagItemSchema = z.object({
  type: z.enum(["PAPER", "PLASTIC", "METAL", "EWASTE", "GLASS", "MIXED"]),
  estimatedWeight: z.number().positive().nullable(),
  pricePerKg: z.number().positive(),
  estimatedAmount: z.number().positive().nullable(),
});

// Create pickup schema
export const createPickupSchema = z.object({
  body: z.object({
    address: addressSchema,
    scheduledDate: z.coerce.date(),
    scheduledSlotId: z.enum(["morning", "afternoon", "evening"]),
    items: z.array(wasteBagItemSchema).min(1, "At least one item is required"),
    assistedMode: z.boolean().default(false),
    notes: z.string().optional(),
  }),
});

// Update pickup schema
export const updatePickupSchema = z.object({
  params: idParamSchema,
  body: z.object({
    status: z
      .enum([
        "REQUESTED",
        "ASSIGNED",
        "ON_THE_WAY",
        "WEIGHING",
        "PICKED",
        "PAID",
        "CANCELLED",
      ])
      .optional(),
    notes: z.string().optional(),
    photoUrl: z.string().url().optional(),
  }),
});

// Get pickups query schema
export const getPickupsSchema = z.object({
  query: z.object({
    status: z
      .enum([
        "REQUESTED",
        "ASSIGNED",
        "ON_THE_WAY",
        "WEIGHING",
        "PICKED",
        "PAID",
        "CANCELLED",
      ])
      .optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

// Collector actions
export const acceptPickupSchema = z.object({
  params: idParamSchema,
});

export const startPickupSchema = z.object({
  params: idParamSchema,
});

export const weighPickupSchema = z.object({
  params: idParamSchema,
  body: z.object({
    items: z.array(
      z.object({
        type: z.enum(["PAPER", "PLASTIC", "METAL", "EWASTE", "GLASS", "MIXED"]),
        actualWeight: z.number().positive(),
        pricePerKg: z.number().positive(),
      })
    ),
  }),
});

export const completePickupSchema = z.object({
  params: idParamSchema,
});

