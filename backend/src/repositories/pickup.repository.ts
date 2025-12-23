import prisma from "@/config/database";
import { PickupRequest, PickupStatus, Prisma } from "@prisma/client";

export interface CreatePickupData {
  customerId: string;
  address: any; // JSON
  scheduledDate: Date;
  scheduledSlotId: string;
  items?: any; // JSON array
  totalEstimatedWeight?: number;
  totalActualWeight?: number;
  totalEstimatedAmount?: number;
  totalActualAmount?: number;
  convenienceFee?: number;
  priceLockExpiresAt?: Date;
  assistedMode?: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface UpdatePickupData {
  status?: PickupStatus;
  collectorId?: string;
  totalActualWeight?: number;
  totalActualAmount?: number;
  items?: any;
  notes?: string;
  photoUrl?: string;
  completedAt?: Date;
  paidAt?: Date;
}

export const pickupRepository = {
  async create(data: CreatePickupData): Promise<PickupRequest> {
    return prisma.pickupRequest.create({
      data,
      include: {
        customer: {
          include: {
            address: true,
          },
        },
        collector: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  async findById(id: string): Promise<PickupRequest | null> {
    return prisma.pickupRequest.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            address: true,
          },
        },
        collector: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  async findMany(
    where?: Prisma.PickupRequestWhereInput,
    skip?: number,
    take?: number
  ): Promise<PickupRequest[]> {
    return prisma.pickupRequest.findMany({
      where,
      skip,
      take,
      include: {
        customer: {
          include: {
            address: true,
          },
        },
        collector: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async count(where?: Prisma.PickupRequestWhereInput): Promise<number> {
    return prisma.pickupRequest.count({ where });
  },

  async update(id: string, data: UpdatePickupData): Promise<PickupRequest> {
    return prisma.pickupRequest.update({
      where: { id },
      data,
      include: {
        customer: {
          include: {
            address: true,
          },
        },
        collector: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  async findAvailableForCollector(
    pincodes: string[],
    skip?: number,
    take?: number
  ): Promise<PickupRequest[]> {
    return prisma.pickupRequest.findMany({
      where: {
        status: "REQUESTED",
        address: {
          path: ["pincode"],
          in: pincodes,
        },
      },
      skip,
      take,
      include: {
        customer: {
          include: {
            address: true,
          },
        },
      },
      orderBy: {
        scheduledDate: "asc",
      },
    });
  },
};

