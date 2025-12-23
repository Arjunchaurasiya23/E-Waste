import { Request, Response, NextFunction } from "express";
import { collectorService } from "@/services/collector.service";
import { sendSuccess, sendError } from "@/utils/response.util";

export const collectorController = {
  getAllCollectors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const result = await collectorService.getAllCollectors(
        status as any,
        Number(page),
        Number(limit)
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  getCollectorById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collector = await collectorService.getCollectorById(req.params.id);
      sendSuccess(res, collector);
    } catch (error) {
      next(error);
    }
  },

  getMyProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const collector = await collectorService.getCollectorByUserId(req.user.userId);
      sendSuccess(res, collector);
    } catch (error) {
      next(error);
    }
  },

  updateCollectorStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const collector = await collectorService.updateCollectorStatus(
        req.params.id,
        status
      );
      sendSuccess(res, collector, "Collector status updated");
    } catch (error) {
      next(error);
    }
  },

  getEarnings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { collectorRepository } = await import("@/repositories/collector.repository");
      const collector = await collectorRepository.findByUserId(req.user.userId);
      if (!collector) {
        return sendError(res, "Collector profile not found", 404);
      }
      const earnings = await collectorService.getCollectorEarnings(collector.id);
      sendSuccess(res, earnings);
    } catch (error) {
      next(error);
    }
  },
};

