import prisma from "@/config/database";
import { Transaction, TransactionType, TransactionStatus, Prisma } from "@prisma/client";

export interface CreateTransactionData {
  userId: string;
  pickupId?: string;
  type: TransactionType;
  amount: number;
  description: string;
  status?: TransactionStatus;
  upiId?: string;
}

export const transactionRepository = {
  async create(data: CreateTransactionData): Promise<Transaction> {
    return prisma.transaction.create({
      data,
    });
  },

  async findById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  },

  async findMany(
    where?: Prisma.TransactionWhereInput,
    skip?: number,
    take?: number
  ): Promise<Transaction[]> {
    return prisma.transaction.findMany({
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

  async count(where?: Prisma.TransactionWhereInput): Promise<number> {
    return prisma.transaction.count({ where });
  },

  async update(
    id: string,
    data: Partial<Transaction>
  ): Promise<Transaction> {
    return prisma.transaction.update({
      where: { id },
      data,
    });
  },

  async getWalletBalance(userId: string): Promise<number> {
    const result = await prisma.transaction.aggregate({
      where: {
        userId,
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate balance: credits add, debits/payouts subtract
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      select: {
        type: true,
        amount: true,
      },
    });

    return transactions.reduce((balance, txn) => {
      if (txn.type === "CREDIT") {
        return balance + Number(txn.amount);
      } else {
        return balance - Number(txn.amount);
      }
    }, 0);
  },
};

