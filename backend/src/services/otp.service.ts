import prisma from "@/config/database";
import env from "@/config/env";
import { BadRequestError } from "@/utils/errors.util";

/**
 * Generate a random OTP code
 */
const generateOTP = (length: number): string => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

/**
 * Send OTP to phone number
 * In mock mode, just logs the OTP. In production, integrate with SMS provider.
 */
const sendOTP = async (phone: string, code: string): Promise<void> => {
  if (env.OTP_MOCK_MODE) {
    console.log(`📱 OTP for ${phone}: ${code} (Mock Mode)`);
    return;
  }

  // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
  // Example:
  // await smsProvider.send(phone, `Your OTP is ${code}. Valid for ${env.OTP_EXPIRES_IN_MINUTES} minutes.`);
  throw new Error("SMS provider not configured. Set OTP_MOCK_MODE=true for development.");
};

/**
 * Create and send OTP
 */
export const createAndSendOTP = async (phone: string): Promise<string> => {
  // Validate phone number (Indian format)
  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new BadRequestError("Invalid phone number. Must be 10 digits starting with 6-9.");
  }

  // Generate OTP
  const code = generateOTP(env.OTP_LENGTH);

  // Calculate expiration
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + env.OTP_EXPIRES_IN_MINUTES);

  // Delete old OTPs for this phone
  await prisma.otp.deleteMany({
    where: { phone },
  });

  // Store OTP
  await prisma.otp.create({
    data: {
      phone,
      code,
      expiresAt,
    },
  });

  // Send OTP
  await sendOTP(phone, code);

  return code; // Return for testing purposes
};

/**
 * Verify OTP
 */
export const verifyOTP = async (phone: string, code: string): Promise<boolean> => {
  const otp = await prisma.otp.findFirst({
    where: {
      phone,
      code,
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otp) {
    return false;
  }

  // Delete used OTP
  await prisma.otp.delete({
    where: { id: otp.id },
  });

  return true;
};

/**
 * Clean up expired OTPs (can be run as a cron job)
 */
export const cleanupExpiredOTPs = async (): Promise<number> => {
  const result = await prisma.otp.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
};

