import { Request, Response, NextFunction } from "express";
import { pricingService } from "@/services/pricing.service";
import { sendSuccess } from "@/utils/response.util";

export const pricingController = {
  getAllPricing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pricing = await pricingService.getAllPricing();
      sendSuccess(res, pricing);
    } catch (error) {
      next(error);
    }
  },

  updatePricing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pricing = await pricingService.updatePricing(req.params.type as any, req.body);
      sendSuccess(res, pricing, "Pricing updated successfully");
    } catch (error) {
      next(error);
    }
  },
};

