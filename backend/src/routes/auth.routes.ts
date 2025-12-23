import { Router } from "express";
import { authController } from "@/controllers/auth.controller";
import { validate } from "@/middleware/validation.middleware";
import { sendOtpSchema, verifyOtpSchema } from "@/validators/auth.validator";
import rateLimit from "express-rate-limit";
import env from "@/config/env";

const router = Router();

// Rate limiting for OTP endpoints
const otpRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: 5, // 5 requests per window
  message: "Too many OTP requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/send-otp",
  otpRateLimit,
  validate(sendOtpSchema),
  authController.sendOTP
);

router.post(
  "/verify-otp",
  otpRateLimit,
  validate(verifyOtpSchema),
  authController.verifyOTP
);

export default router;

