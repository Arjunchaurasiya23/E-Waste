import { Request, Response, NextFunction } from "express";
import { pickupService } from "@/services/pickup.service";
import { sendSuccess, sendError } from "@/utils/response.util";

export const pickupController = {
  createPickup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const pickup = await pickupService.createPickup({
        ...req.body,
        customerId: req.user.userId,
      });
      sendSuccess(res, pickup, "Pickup request created successfully", 201);
    } catch (error) {
      next(error);
    }
  },

  getPickups: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { status, page = 1, limit = 10 } = req.query;
      const result = await pickupService.getUserPickups(
        req.user.userId,
        status as any,
        Number(page),
        Number(limit)
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  getPickupById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const pickup = await pickupService.getPickupById(
        req.params.id,
        req.user.userId
      );
      sendSuccess(res, pickup);
    } catch (error) {
      next(error);
    }
  },

  updatePickup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { status, ...updates } = req.body;
      let pickup;

      if (status) {
        pickup = await pickupService.updatePickupStatus(
          req.params.id,
          status,
          req.user.userId,
          req.user.role
        );
      } else {
        pickup = await pickupService.getPickupById(req.params.id, req.user.userId);
        // Handle other updates if needed
      }

      sendSuccess(res, pickup, "Pickup updated successfully");
    } catch (error) {
      next(error);
    }
  },

  // Collector actions
  acceptPickup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      // Get collector ID from user
      const { collectorRepository } = await import("@/repositories/collector.repository");
      const collector = await collectorRepository.findByUserId(req.user.userId);
      if (!collector) {
        return sendError(res, "Collector profile not found", 404);
      }

      const pickup = await pickupService.acceptPickup(req.params.id, collector.id);
      sendSuccess(res, pickup, "Pickup accepted successfully");
    } catch (error) {
      next(error);
    }
  },

  startPickup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { collectorRepository } = await import("@/repositories/collector.repository");
      const collector = await collectorRepository.findByUserId(req.user.userId);
      if (!collector) {
        return sendError(res, "Collector profile not found", 404);
      }

      const pickup = await pickupService.startPickup(req.params.id, collector.id);
      sendSuccess(res, pickup, "Pickup started");
    } catch (error) {
      next(error);
    }
  },

  weighPickup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { collectorRepository } = await import("@/repositories/collector.repository");
      const collector = await collectorRepository.findByUserId(req.user.userId);
      if (!collector) {
        return sendError(res, "Collector profile not found", 404);
      }

      const pickup = await pickupService.submitWeight(
        req.params.id,
        collector.id,
        req.body.items
      );
      sendSuccess(res, pickup, "Weight submitted successfully");
    } catch (error) {
      next(error);
    }
  },

  completePickup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { collectorRepository } = await import("@/repositories/collector.repository");
      const collector = await collectorRepository.findByUserId(req.user.userId);
      if (!collector) {
        return sendError(res, "Collector profile not found", 404);
      }

      const pickup = await pickupService.completePickup(req.params.id, collector.id);
      sendSuccess(res, pickup, "Pickup completed successfully");
    } catch (error) {
      next(error);
    }
  },

  getAvailablePickups: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { page = 1, limit = 10 } = req.query;
      const pickups = await pickupService.getAvailablePickups(
        req.user.userId,
        Number(page),
        Number(limit)
      );
      sendSuccess(res, pickups);
    } catch (error) {
      next(error);
    }
  },
};

