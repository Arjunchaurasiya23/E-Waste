import { Request, Response, NextFunction } from "express";
import { userService } from "@/services/user.service";
import { sendSuccess, sendError } from "@/utils/response.util";

export const userController = {
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const user = await userService.getProfile(req.user.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const user = await userService.updateProfile(req.user.userId, req.body);
      sendSuccess(res, user, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  },

  getAddress: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const address = await userService.getAddress(req.user.userId);
      sendSuccess(res, address);
    } catch (error) {
      next(error);
    }
  },
};

