// User roles
export type UserRole = "customer" | "collector" | "admin";

// Waste types
export type WasteType = "paper" | "plastic" | "metal" | "ewaste" | "glass" | "mixed";

// Pickup status - enhanced with more granular states
export type PickupStatus = "requested" | "assigned" | "on_the_way" | "weighing" | "picked" | "paid";

// User interface
export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  email?: string;
  address?: Address;
  pincode?: string;
  createdAt: Date;
  language: "en" | "hi";
}

// Address
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

// Waste pricing (per kg)
export interface WastePricing {
  type: WasteType;
  pricePerKg: number;
  minQuantity: number;
  icon: string;
  label: {
    en: string;
    hi: string;
  };
}

// Waste bag item - for multi-item pickup
export interface WasteBagItem {
  id: string;
  type: WasteType;
  estimatedWeight: number | null; // null means "unknown"
  pricePerKg: number;
  estimatedAmount: number | null;
  actualWeight?: number;
  actualAmount?: number;
}

// Enhanced Pickup request with multiple items
export interface PickupRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: Address;
  // Legacy single item fields (for backward compatibility)
  wasteType: WasteType;
  estimatedWeight: number;
  actualWeight?: number;
  estimatedAmount: number;
  actualAmount?: number;
  // New multi-item support
  items?: WasteBagItem[];
  totalEstimatedWeight?: number;
  totalActualWeight?: number;
  totalEstimatedAmount?: number;
  totalActualAmount?: number;
  // Assisted pickup mode
  assistedMode?: boolean;
  // Status and scheduling
  status: PickupStatus;
  scheduledDate: Date;
  scheduledSlot: TimeSlot;
  collectorId?: string;
  collectorName?: string;
  notes?: string;
  photoUrl?: string;
  // Pricing lock
  priceLockExpiresAt?: Date;
  // Convenience fee for small pickups
  convenienceFee?: number;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  paidAt?: Date;
}

// Time slot
export interface TimeSlot {
  id: string;
  label: {
    en: string;
    hi: string;
  };
  startTime: string;
  endTime: string;
}

// Transaction
export interface Transaction {
  id: string;
  userId: string;
  pickupId?: string;
  type: "credit" | "debit" | "payout";
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  upiId?: string;
  createdAt: Date;
}

// Collector
export interface Collector {
  id: string;
  userId: string;
  name: string;
  phone: string;
  status: "pending" | "approved" | "suspended";
  pincodes: string[];
  rating: number;
  totalPickups: number;
  totalEarnings: number;
  commissionRate: number;
  joinedAt: Date;
}

// Analytics
export interface DailyAnalytics {
  date: Date;
  totalPickups: number;
  totalWeight: number;
  totalRevenue: number;
  totalPayouts: number;
  byWasteType: {
    type: WasteType;
    weight: number;
    revenue: number;
  }[];
  topCollectors: {
    id: string;
    name: string;
    pickups: number;
    weight: number;
  }[];
}

// App settings
export interface AppSettings {
  pincodesCovered: string[];
  collectorCommissionRate: number;
  minPickupAmount: number;
  maxScheduleDays: number;
  minFreePickupWeight: number;
  convenienceFee: number;
  priceLockHours: number;
}

// Admin settings for UI
export interface AdminSettings {
  minFreePickupWeight: number;
  convenienceFee: number;
  priceLockHours: number;
  areaCoverage: {
    pincode: string;
    enabled: boolean;
    collectorsCount: number;
  }[];
}
