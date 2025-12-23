import { Request, Response, NextFunction } from "express";
import { adminService } from "@/services/admin.service";
import { sendSuccess } from "@/utils/response.util";

export const adminController = {
  getDashboardStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await adminService.getDashboardStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  },

  getAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await adminService.getAnalytics(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      sendSuccess(res, analytics);
    } catch (error) {
      next(error);
    }
  },
};

