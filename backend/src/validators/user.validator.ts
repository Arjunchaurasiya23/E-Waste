import { z } from "zod";
import { addressSchema, idParamSchema } from "./common.validator";

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email").optional(),
    language: z.enum(["en", "hi"]).optional(),
    pincode: z.string().regex(/^\d{6}$/).optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: addressSchema,
});

export const getUserSchema = z.object({
  params: idParamSchema,
});

