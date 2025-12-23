import { CollectorStatus } from "@prisma/client";
import { collectorRepository } from "@/repositories/collector.repository";
import { NotFoundError, ForbiddenError } from "@/utils/errors.util";

export const collectorService = {
  /**
   * Get all collectors (admin only)
   */
  async getAllCollectors(status?: CollectorStatus, page = 1, limit = 10) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;
    const [collectors, total] = await Promise.all([
      collectorRepository.findMany(where, skip, limit),
      collectorRepository.count(where),
    ]);

    return {
      collectors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get collector by ID
   */
  async getCollectorById(id: string) {
    const collector = await collectorRepository.findById(id);
    if (!collector) {
      throw new NotFoundError("Collector");
    }
    return collector;
  },

  /**
   * Get collector profile by user ID
   */
  async getCollectorByUserId(userId: string) {
    const collector = await collectorRepository.findByUserId(userId);
    if (!collector) {
      throw new NotFoundError("Collector profile");
    }
    return collector;
  },

  /**
   * Update collector status (admin only)
   */
  async updateCollectorStatus(id: string, status: CollectorStatus) {
    const collector = await collectorRepository.findById(id);
    if (!collector) {
      throw new NotFoundError("Collector");
    }
    return collectorRepository.update(id, { status });
  },

  /**
   * Get collector earnings
   */
  async getCollectorEarnings(collectorId: string) {
    const collector = await collectorRepository.findById(collectorId);
    if (!collector) {
      throw new NotFoundError("Collector");
    }

    return {
      totalEarnings: Number(collector.totalEarnings),
      totalPickups: collector.totalPickups,
      commissionRate: collector.commissionRate,
      rating: collector.rating,
    };
  },
};

