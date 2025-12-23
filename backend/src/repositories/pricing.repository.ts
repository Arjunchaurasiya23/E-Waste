import prisma from "@/config/database";
import { WastePricing, WasteType } from "@prisma/client";

export interface UpdatePricingData {
  pricePerKg?: number;
  minQuantity?: number;
  isActive?: boolean;
}

export const pricingRepository = {
  async findAll(): Promise<WastePricing[]> {
    return prisma.wastePricing.findMany({
      where: { isActive: true },
      orderBy: { type: "asc" },
    });
  },

  async findByType(type: WasteType): Promise<WastePricing | null> {
    return prisma.wastePricing.findUnique({
      where: { type },
    });
  },

  async update(type: WasteType, data: UpdatePricingData): Promise<WastePricing> {
    return prisma.wastePricing.update({
      where: { type },
      data,
    });
  },
};

