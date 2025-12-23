import { TransactionType, TransactionStatus } from "@prisma/client";
import { transactionRepository } from "@/repositories/transaction.repository";
import { NotFoundError, BadRequestError } from "@/utils/errors.util";

export const transactionService = {
  /**
   * Get user transactions
   */
  async getUserTransactions(
    userId: string,
    type?: TransactionType,
    page = 1,
    limit = 10
  ) {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      transactionRepository.findMany(where, skip, limit),
      transactionRepository.count(where),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get wallet balance
   */
  async getWalletBalance(userId: string) {
    const balance = await transactionRepository.getWalletBalance(userId);
    return { balance };
  },

  /**
   * Request payout
   */
  async requestPayout(userId: string, amount: number, upiId: string) {
    // Get current balance
    const balance = await transactionRepository.getWalletBalance(userId);

    if (balance < amount) {
      throw new BadRequestError("Insufficient balance");
    }

    if (!upiId || !upiId.includes("@")) {
      throw new BadRequestError("Invalid UPI ID");
    }

    // Create payout transaction
    const transaction = await transactionRepository.create({
      userId,
      type: "PAYOUT",
      amount,
      description: `Payout to ${upiId}`,
      status: "PENDING",
      upiId,
    });

    // TODO: Integrate with payment gateway
    // For now, mark as completed immediately (mock)
    // In production, this would be processed asynchronously

    return transaction;
  },
};

