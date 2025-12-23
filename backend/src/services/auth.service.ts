import { UserRole } from "@prisma/client";
import { createAndSendOTP, verifyOTP } from "./otp.service";
import { userRepository } from "@/repositories/user.repository";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt.util";
import { BadRequestError, UnauthorizedError } from "@/utils/errors.util";
import { collectorRepository } from "@/repositories/collector.repository";
import { DEFAULT_COMMISSION_RATE } from "@/config/constants";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    name: string;
    role: UserRole;
    email?: string | null;
    language: string;
  };
}

export const authService = {
  /**
   * Send OTP to phone number
   */
  async sendOTP(phone: string): Promise<{ message: string }> {
    await createAndSendOTP(phone);
    return {
      message: "OTP sent successfully",
    };
  },

  /**
   * Verify OTP and login/register user
   */
  async verifyOTP(
    phone: string,
    code: string,
    role?: UserRole
  ): Promise<AuthTokens> {
    // Verify OTP
    const isValid = await verifyOTP(phone, code);
    if (!isValid) {
      throw new UnauthorizedError("Invalid or expired OTP");
    }

    // Find or create user
    let user = await userRepository.findByPhone(phone);

    if (!user) {
      // Create new user
      if (!role) {
        throw new BadRequestError("Role is required for new users");
      }

      user = await userRepository.create({
        phone,
        name: `User ${phone.slice(-4)}`, // Default name
        role,
        language: "en",
      });

      // Create role-specific profile
      if (role === "COLLECTOR") {
        await collectorRepository.create({
          userId: user.id,
          pincodes: [],
          commissionRate: DEFAULT_COMMISSION_RATE,
        });
      } else if (role === "CUSTOMER") {
        // Customer profile will be created automatically via Prisma relation
      }
    } else {
      // Existing user - verify role matches if provided
      if (role && user.role !== role) {
        throw new BadRequestError(
          `User already exists with role ${user.role}. Cannot login as ${role}.`
        );
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      phone: user.phone,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
      phone: user.phone,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        email: user.email,
        language: user.language,
      },
    };
  },
};

