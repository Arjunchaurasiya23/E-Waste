import prisma from "@/config/database";
import { Collector, CollectorStatus, Prisma } from "@prisma/client";

export interface CreateCollectorData {
  userId: string;
  pincodes: string[];
  commissionRate?: number;
}

export interface UpdateCollectorData {
  status?: CollectorStatus;
  pincodes?: string[];
  rating?: number;
  commissionRate?: number;
}

export const collectorRepository = {
  async create(data: CreateCollectorData): Promise<Collector> {
    return prisma.collector.create({
      data: {
        ...data,
        commissionRate: data.commissionRate || 15,
      },
      include: {
        user: true,
      },
    });
  },

  async findById(id: string): Promise<Collector | null> {
    return prisma.collector.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  },

  async findByUserId(userId: string): Promise<Collector | null> {
    return prisma.collector.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  },

  async findMany(
    where?: Prisma.CollectorWhereInput,
    skip?: number,
    take?: number
  ): Promise<Collector[]> {
    return prisma.collector.findMany({
      where,
      skip,
      take,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async count(where?: Prisma.CollectorWhereInput): Promise<number> {
    return prisma.collector.count({ where });
  },

  async update(id: string, data: UpdateCollectorData): Promise<Collector> {
    return prisma.collector.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  },

  async updateStats(
    id: string,
    stats: {
      totalPickups?: number;
      totalEarnings?: number;
      rating?: number;
    }
  ): Promise<Collector> {
    return prisma.collector.update({
      where: { id },
      data: stats,
    });
  },
};

