import prisma from "@/config/database";
import { pickupRepository } from "@/repositories/pickup.repository";
import { transactionRepository } from "@/repositories/transaction.repository";
import { collectorRepository } from "@/repositories/collector.repository";

export const adminService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [
      totalPickups,
      totalCustomers,
      totalCollectors,
      activeCollectors,
      pendingPickups,
      completedPickupsToday,
      totalRevenue,
      totalPayouts,
    ] = await Promise.all([
      pickupRepository.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      collectorRepository.count(),
      collectorRepository.count({ where: { status: "APPROVED" } }),
      pickupRepository.count({ where: { status: "REQUESTED" } }),
      pickupRepository.count({
        where: {
          status: "PAID",
          paidAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      transactionRepository.count({
        where: {
          type: "CREDIT",
          status: "COMPLETED",
        },
      }),
      transactionRepository.count({
        where: {
          type: "PAYOUT",
          status: "COMPLETED",
        },
      }),
    ]);

    return {
      totalPickups,
      totalCustomers,
      totalCollectors,
      activeCollectors,
      pendingPickups,
      completedPickupsToday,
      totalRevenue,
      totalPayouts,
    };
  },

  /**
   * Get analytics data
   */
  async getAnalytics(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const pickups = await pickupRepository.findMany(where);

    // Calculate analytics
    const totalWeight = pickups.reduce(
      (sum, p) => sum + (Number(p.totalActualWeight) || 0),
      0
    );
    const totalRevenue = pickups.reduce(
      (sum, p) => sum + (Number(p.totalActualAmount) || 0),
      0
    );

    // Group by waste type
    const byWasteType: Record<string, { weight: number; revenue: number }> = {};
    pickups.forEach((pickup) => {
      const items = (pickup.items as any[]) || [];
      items.forEach((item: any) => {
        const type = item.type;
        if (!byWasteType[type]) {
          byWasteType[type] = { weight: 0, revenue: 0 };
        }
        byWasteType[type].weight += item.actualWeight || 0;
        byWasteType[type].revenue += item.actualAmount || 0;
      });
    });

    return {
      totalPickups: pickups.length,
      totalWeight,
      totalRevenue,
      byWasteType: Object.entries(byWasteType).map(([type, data]) => ({
        type,
        ...data,
      })),
    };
  },
};

