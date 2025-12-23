import { z } from "zod";

// Phone number validation (Indian format)
export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Phone number must be 10 digits starting with 6-9");

// Pincode validation (Indian format)
export const pincodeSchema = z
  .string()
  .regex(/^\d{6}$/, "Pincode must be 6 digits");

// Address schema
export const addressSchema = z.object({
  line1: z.string().min(5, "Address line 1 must be at least 5 characters"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: pincodeSchema,
  landmark: z.string().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// ID parameter schema
export const idParamSchema = z.object({
  id: z.string().cuid("Invalid ID format"),
});

