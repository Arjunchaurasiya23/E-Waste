import { Request, Response, NextFunction } from "express";
import { authService } from "@/services/auth.service";
import { sendSuccess, sendError } from "@/utils/response.util";
import { AppError } from "@/utils/errors.util";

export const authController = {
  sendOTP: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone } = req.body;
      const result = await authService.sendOTP(phone);
      sendSuccess(res, result, "OTP sent successfully");
    } catch (error) {
      next(error);
    }
  },

  verifyOTP: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, code, role } = req.body;
      const result = await authService.verifyOTP(phone, code, role);
      sendSuccess(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  },
};

