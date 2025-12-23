import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { ForbiddenError } from "@/utils/errors.util";
import { sendError } from "@/utils/response.util";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "Authentication required", 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, "Insufficient permissions", 403);
      return;
    }

    next();
  };
};

