import { WasteType } from "@prisma/client";
import { pricingRepository } from "@/repositories/pricing.repository";
import { NotFoundError } from "@/utils/errors.util";

export const pricingService = {
  /**
   * Get all active pricing
   */
  async getAllPricing() {
    return pricingRepository.findAll();
  },

  /**
   * Get pricing by type
   */
  async getPricingByType(type: WasteType) {
    const pricing = await pricingRepository.findByType(type);
    if (!pricing) {
      throw new NotFoundError("Pricing");
    }
    return pricing;
  },

  /**
   * Update pricing (admin only)
   */
  async updatePricing(
    type: WasteType,
    data: { pricePerKg?: number; minQuantity?: number; isActive?: boolean }
  ) {
    const pricing = await pricingRepository.findByType(type);
    if (!pricing) {
      throw new NotFoundError("Pricing");
    }
    return pricingRepository.update(type, data);
  },
};

