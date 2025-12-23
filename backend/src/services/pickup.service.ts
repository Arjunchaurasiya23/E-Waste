import { PickupStatus } from "@prisma/client";
import { pickupRepository } from "@/repositories/pickup.repository";
import { pricingRepository } from "@/repositories/pricing.repository";
import { transactionRepository } from "@/repositories/transaction.repository";
import { collectorRepository } from "@/repositories/collector.repository";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/utils/errors.util";
import { PICKUP_STATUS_FLOW } from "@/config/constants";
import prisma from "@/config/database";

export interface CreatePickupData {
  customerId: string;
  address: any;
  scheduledDate: Date;
  scheduledSlotId: string;
  items: Array<{
    type: string;
    estimatedWeight: number | null;
    pricePerKg: number;
    estimatedAmount: number | null;
  }>;
  assistedMode?: boolean;
  notes?: string;
}

export const pickupService = {
  /**
   * Create a new pickup request
   */
  async createPickup(data: CreatePickupData) {
    // Get pricing for all items
    const pricingMap = new Map();
    for (const item of data.items) {
      const pricing = await pricingRepository.findByType(item.type as any);
      if (!pricing || !pricing.isActive) {
        throw new BadRequestError(`Pricing not found for waste type: ${item.type}`);
      }
      pricingMap.set(item.type, pricing);
    }

    // Calculate totals
    let totalEstimatedWeight: number | null = null;
    let totalEstimatedAmount: number | null = null;
    let hasUnknownWeight = false;

    for (const item of data.items) {
      if (item.estimatedWeight === null) {
        hasUnknownWeight = true;
        break;
      }
      totalEstimatedWeight = (totalEstimatedWeight || 0) + item.estimatedWeight;
      totalEstimatedAmount = (totalEstimatedAmount || 0) + (item.estimatedAmount || 0);
    }

    // Calculate price lock expiration (24 hours from now)
    const priceLockExpiresAt = new Date();
    priceLockExpiresAt.setHours(priceLockExpiresAt.getHours() + 24);

    // Create pickup
    const pickup = await pickupRepository.create({
      customerId: data.customerId,
      address: data.address,
      scheduledDate: data.scheduledDate,
      scheduledSlotId: data.scheduledSlotId,
      items: data.items,
      totalEstimatedWeight: totalEstimatedWeight || undefined,
      totalEstimatedAmount: totalEstimatedAmount || undefined,
      assistedMode: data.assistedMode || false,
      notes: data.notes,
      priceLockExpiresAt,
    });

    return pickup;
  },

  /**
   * Get user's pickups
   */
  async getUserPickups(
    userId: string,
    status?: PickupStatus,
    page = 1,
    limit = 10
  ) {
    const where: any = { customerId: userId };
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;
    const [pickups, total] = await Promise.all([
      pickupRepository.findMany(where, skip, limit),
      pickupRepository.count(where),
    ]);

    return {
      pickups,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get pickup by ID
   */
  async getPickupById(id: string, userId?: string) {
    const pickup = await pickupRepository.findById(id);
    if (!pickup) {
      throw new NotFoundError("Pickup");
    }

    // Check access
    if (userId && pickup.customerId !== userId) {
      // Allow collectors and admins to view
      // This will be checked by role middleware
    }

    return pickup;
  },

  /**
   * Update pickup status
   */
  async updatePickupStatus(
    id: string,
    status: PickupStatus,
    userId: string,
    userRole: string
  ) {
    const pickup = await pickupRepository.findById(id);
    if (!pickup) {
      throw new NotFoundError("Pickup");
    }

    // Validate status transition
    const allowedStatuses = PICKUP_STATUS_FLOW[pickup.status as keyof typeof PICKUP_STATUS_FLOW];
    if (!allowedStatuses.includes(status)) {
      throw new BadRequestError(
        `Cannot transition from ${pickup.status} to ${status}`
      );
    }

    // Role-based access control
    if (userRole === "CUSTOMER") {
      if (pickup.customerId !== userId) {
        throw new ForbiddenError("You can only update your own pickups");
      }
      // Customers can only cancel
      if (status !== "CANCELLED") {
        throw new ForbiddenError("Customers can only cancel pickups");
      }
    }

    return pickupRepository.update(id, { status });
  },

  /**
   * Collector accepts a pickup
   */
  async acceptPickup(pickupId: string, collectorId: string) {
    const pickup = await pickupRepository.findById(pickupId);
    if (!pickup) {
      throw new NotFoundError("Pickup");
    }

    if (pickup.status !== "REQUESTED") {
      throw new BadRequestError("Pickup is not available for assignment");
    }

    // Verify collector can serve this area
    const collector = await collectorRepository.findByUserId(collectorId);
    if (!collector || collector.status !== "APPROVED") {
      throw new ForbiddenError("Collector not approved");
    }

    // Extract pincode from address JSON
    const address = pickup.address as any;
    const pincode = address?.pincode;

    if (!collector.pincodes.includes(pincode)) {
      throw new BadRequestError("Collector does not serve this area");
    }

    return pickupRepository.update(pickupId, {
      status: "ASSIGNED",
      collectorId: collector.id,
    });
  },

  /**
   * Collector starts pickup (on the way)
   */
  async startPickup(pickupId: string, collectorId: string) {
    const pickup = await pickupRepository.findById(pickupId);
    if (!pickup) {
      throw new NotFoundError("Pickup");
    }

    if (pickup.status !== "ASSIGNED" || pickup.collectorId !== collectorId) {
      throw new BadRequestError("Pickup not assigned to this collector");
    }

    return pickupRepository.update(pickupId, {
      status: "ON_THE_WAY",
    });
  },

  /**
   * Collector submits weight (weighing)
   */
  async submitWeight(
    pickupId: string,
    collectorId: string,
    items: Array<{
      type: string;
      actualWeight: number;
      pricePerKg: number;
    }>
  ) {
    const pickup = await pickupRepository.findById(pickupId);
    if (!pickup) {
      throw new NotFoundError("Pickup");
    }

    if (pickup.status !== "ON_THE_WAY" || pickup.collectorId !== collectorId) {
      throw new BadRequestError("Invalid pickup status");
    }

    // Calculate totals
    const totalActualWeight = items.reduce((sum, item) => sum + item.actualWeight, 0);
    const totalActualAmount = items.reduce(
      (sum, item) => sum + item.actualWeight * item.pricePerKg,
      0
    );

    // Update items with actual weights
    const updatedItems = (pickup.items as any[]).map((item: any) => {
      const submittedItem = items.find((i) => i.type === item.type);
      if (submittedItem) {
        return {
          ...item,
          actualWeight: submittedItem.actualWeight,
          actualAmount: submittedItem.actualWeight * submittedItem.pricePerKg,
        };
      }
      return item;
    });

    return pickupRepository.update(pickupId, {
      status: "WEIGHING",
      totalActualWeight,
      totalActualAmount,
      items: updatedItems,
    });
  },

  /**
   * Collector completes pickup
   */
  async completePickup(pickupId: string, collectorId: string) {
    const pickup = await pickupRepository.findById(pickupId);
    if (!pickup) {
      throw new NotFoundError("Pickup");
    }

    if (pickup.status !== "WEIGHING" || pickup.collectorId !== collectorId) {
      throw new BadRequestError("Invalid pickup status");
    }

    if (!pickup.totalActualAmount) {
      throw new BadRequestError("Weight must be submitted before completing");
    }

    return pickupRepository.update(pickupId, {
      status: "PICKED",
      completedAt: new Date(),
    });
  },

  /**
   * Mark pickup as paid and create transaction
   */
  async markAsPaid(pickupId: string) {
    return prisma.$transaction(async (tx) => {
      const pickup = await tx.pickupRequest.findUnique({
        where: { id: pickupId },
        include: { collector: true },
      });

      if (!pickup) {
        throw new NotFoundError("Pickup");
      }

      if (pickup.status !== "PICKED") {
        throw new BadRequestError("Pickup must be picked before payment");
      }

      if (!pickup.totalActualAmount) {
        throw new BadRequestError("Amount not calculated");
      }

      // Update pickup status
      const updatedPickup = await tx.pickupRequest.update({
        where: { id: pickupId },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      // Create credit transaction for customer
      await tx.transaction.create({
        data: {
          userId: pickup.customerId,
          pickupId: pickup.id,
          type: "CREDIT",
          amount: pickup.totalActualAmount,
          description: `Payment for pickup #${pickup.id.slice(-6)}`,
          status: "COMPLETED",
        },
      });

      // Create earnings for collector if assigned
      if (pickup.collectorId && pickup.collector) {
        const commissionAmount =
          (Number(pickup.totalActualAmount) * pickup.collector.commissionRate) / 100;

        await tx.transaction.create({
          data: {
            userId: pickup.collector.userId,
            pickupId: pickup.id,
            type: "CREDIT",
            amount: commissionAmount,
            description: `Commission for pickup #${pickup.id.slice(-6)}`,
            status: "COMPLETED",
          },
        });

        // Update collector stats
        await tx.collector.update({
          where: { id: pickup.collectorId },
          data: {
            totalPickups: { increment: 1 },
            totalEarnings: { increment: commissionAmount },
          },
        });
      }

      return updatedPickup;
    });
  },

  /**
   * Get available pickups for collector
   */
  async getAvailablePickups(collectorId: string, page = 1, limit = 10) {
    const collector = await collectorRepository.findByUserId(collectorId);
    if (!collector || collector.status !== "APPROVED") {
      throw new ForbiddenError("Collector not approved");
    }

    const skip = (page - 1) * limit;
    const pickups = await pickupRepository.findAvailableForCollector(
      collector.pincodes,
      skip,
      limit
    );

    return pickups;
  },
};

