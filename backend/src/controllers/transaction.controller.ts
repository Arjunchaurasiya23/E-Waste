import { Request, Response, NextFunction } from "express";
import { transactionService } from "@/services/transaction.service";
import { sendSuccess, sendError } from "@/utils/response.util";

export const transactionController = {
  getTransactions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { type, page = 1, limit = 10 } = req.query;
      const result = await transactionService.getUserTransactions(
        req.user.userId,
        type as any,
        Number(page),
        Number(limit)
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  getWalletBalance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const result = await transactionService.getWalletBalance(req.user.userId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  requestPayout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const { amount, upiId } = req.body;
      const transaction = await transactionService.requestPayout(
        req.user.userId,
        amount,
        upiId
      );
      sendSuccess(res, transaction, "Payout request created", 201);
    } catch (error) {
      next(error);
    }
  },
};

