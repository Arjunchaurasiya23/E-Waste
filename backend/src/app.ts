import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import env from "@/config/env";
import { errorHandler, notFoundHandler } from "@/middleware/error.middleware";

// Routes
import authRoutes from "@/routes/auth.routes";
import userRoutes from "@/routes/user.routes";
import pickupRoutes from "@/routes/pickup.routes";
import transactionRoutes from "@/routes/transaction.routes";
import collectorRoutes from "@/routes/collector.routes";
import pricingRoutes from "@/routes/pricing.routes";
import adminRoutes from "@/routes/admin.routes";

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(","),
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/users`, userRoutes);
app.use(`${env.API_PREFIX}/pickups`, pickupRoutes);
app.use(`${env.API_PREFIX}/transactions`, transactionRoutes);
app.use(`${env.API_PREFIX}/collectors`, collectorRoutes);
app.use(`${env.API_PREFIX}/pricing`, pricingRoutes);
app.use(`${env.API_PREFIX}/admin`, adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

