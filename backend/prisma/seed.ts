import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed waste pricing
  const pricingData = [
    {
      type: "PAPER" as const,
      pricePerKg: 14,
      minQuantity: 2,
      icon: "📰",
      labelEn: "Paper / Cardboard",
      labelHi: "कागज / गत्ता",
    },
    {
      type: "PLASTIC" as const,
      pricePerKg: 10,
      minQuantity: 1,
      icon: "🥤",
      labelEn: "Plastic",
      labelHi: "प्लास्टिक",
    },
    {
      type: "METAL" as const,
      pricePerKg: 35,
      minQuantity: 1,
      icon: "🔩",
      labelEn: "Metal / Iron",
      labelHi: "धातु / लोहा",
    },
    {
      type: "EWASTE" as const,
      pricePerKg: 20,
      minQuantity: 0.5,
      icon: "📱",
      labelEn: "E-Waste",
      labelHi: "ई-कचरा",
    },
    {
      type: "GLASS" as const,
      pricePerKg: 5,
      minQuantity: 2,
      icon: "🍾",
      labelEn: "Glass",
      labelHi: "कांच",
    },
    {
      type: "MIXED" as const,
      pricePerKg: 8,
      minQuantity: 5,
      icon: "♻️",
      labelEn: "Mixed Waste",
      labelHi: "मिश्रित कचरा",
    },
  ];

  for (const pricing of pricingData) {
    await prisma.wastePricing.upsert({
      where: { type: pricing.type },
      update: pricing,
      create: pricing,
    });
  }

  console.log("✅ Seeded waste pricing");

  // Create default admin user (for testing)
  const adminUser = await prisma.user.upsert({
    where: { phone: "9876543212" },
    update: {},
    create: {
      phone: "9876543212",
      name: "Admin User",
      role: "ADMIN",
      language: "en",
    },
  });

  console.log("✅ Seeded admin user");

  // Create default customer (for testing)
  const customerUser = await prisma.user.upsert({
    where: { phone: "9876543210" },
    update: {},
    create: {
      phone: "9876543210",
      name: "Rahul Sharma",
      role: "CUSTOMER",
      language: "en",
      pincode: "110016",
      customerProfile: {
        create: {
          walletBalance: 0,
          totalPickups: 0,
        },
      },
      address: {
        create: {
          line1: "123, Green Park Colony",
          city: "Delhi",
          state: "Delhi",
          pincode: "110016",
        },
      },
    },
  });

  console.log("✅ Seeded customer user");

  // Create default collector (for testing)
  const collectorUser = await prisma.user.upsert({
    where: { phone: "9876543211" },
    update: {},
    create: {
      phone: "9876543211",
      name: "Ramesh Kumar",
      role: "COLLECTOR",
      language: "hi",
      pincode: "110016",
      collectorProfile: {
        create: {
          status: "APPROVED",
          pincodes: ["110016", "110017", "110018"],
          rating: 4.8,
          totalPickups: 0,
          totalEarnings: 0,
          commissionRate: 15,
        },
      },
    },
  });

  console.log("✅ Seeded collector user");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

