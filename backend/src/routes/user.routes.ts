import { Router } from "express";
import { userController } from "@/controllers/user.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validation.middleware";
import { updateUserSchema, updateAddressSchema } from "@/validators/user.validator";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/me", userController.getProfile);
router.put("/me", validate(updateUserSchema), userController.updateProfile);
router.get("/me/address", userController.getAddress);
// Note: Address update would need a separate endpoint with address repository

export default router;

