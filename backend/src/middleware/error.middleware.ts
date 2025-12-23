import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/errors.util";
import { sendError } from "@/utils/response.util";
import env from "@/config/env";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Log error
  console.error("Error:", err);

  // Handle known AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    // @ts-ignore
    if (err.code === "P2002") {
      return sendError(res, "Duplicate entry", 409);
    }
    // @ts-ignore
    if (err.code === "P2025") {
      return sendError(res, "Record not found", 404);
    }
  }

  // Handle validation errors
  if (err.name === "ZodError") {
    return sendError(res, "Validation error", 400);
  }

  // Default error
  const message =
    env.NODE_ENV === "production" ? "Internal server error" : err.message;
  return sendError(res, message, 500);
};

// 404 handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

