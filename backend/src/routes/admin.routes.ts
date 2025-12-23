import { Router } from "express";
import { adminController } from "@/controllers/admin.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { requireRole } from "@/middleware/role.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole(UserRole.ADMIN));

router.get("/dashboard", adminController.getDashboardStats);
router.get("/analytics", adminController.getAnalytics);

export default router;

