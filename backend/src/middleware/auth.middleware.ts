import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt.util";
import { UnauthorizedError } from "@/utils/errors.util";
import { sendError } from "@/utils/response.util";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7);

    try {
      const payload = verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        role: payload.role as any,
        phone: payload.phone,
      };
      next();
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      sendError(res, error.message, error.statusCode);
      return;
    }
    next(error);
  }
};

