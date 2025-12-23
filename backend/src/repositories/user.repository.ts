import prisma from "@/config/database";
import { User, UserRole, Prisma } from "@prisma/client";

export interface CreateUserData {
  phone: string;
  name: string;
  role: UserRole;
  email?: string;
  language?: string;
  pincode?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  language?: string;
  pincode?: string;
}

export const userRepository = {
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data,
    });
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        customerProfile: true,
        collectorProfile: true,
        address: true,
      },
    });
  },

  async findByPhone(phone: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { phone },
      include: {
        customerProfile: true,
        collectorProfile: true,
        address: true,
      },
    });
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },

  async findMany(where?: Prisma.UserWhereInput): Promise<User[]> {
    return prisma.user.findMany({
      where,
      include: {
        customerProfile: true,
        collectorProfile: true,
      },
    });
  },
};

