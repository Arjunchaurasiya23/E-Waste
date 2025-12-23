import { Router } from "express";
import { transactionController } from "@/controllers/transaction.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { z } from "zod";
import { validate } from "@/middleware/validation.middleware";

const router = Router();

router.use(authenticate);

const getTransactionsSchema = z.object({
  query: z.object({
    type: z.enum(["CREDIT", "DEBIT", "PAYOUT"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

const requestPayoutSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    upiId: z.string().regex(/^[\w.-]+@[\w]+$/, "Invalid UPI ID format"),
  }),
});

router.get(
  "/",
  validate(getTransactionsSchema),
  transactionController.getTransactions
);

router.get("/wallet/balance", transactionController.getWalletBalance);

router.post(
  "/wallet/payout",
  validate(requestPayoutSchema),
  transactionController.requestPayout
);

export default router;

