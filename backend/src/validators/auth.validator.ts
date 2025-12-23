import { z } from "zod";
import { phoneSchema } from "./common.validator";

export const sendOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema,
    code: z.string().length(4, "OTP must be 4 digits"),
    role: z.enum(["CUSTOMER", "COLLECTOR", "ADMIN"]).optional(),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

