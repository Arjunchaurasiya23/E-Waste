// Time slots configuration
export const TIME_SLOTS = {
  morning: {
    id: "morning",
    label: { en: "Morning (9 AM - 12 PM)", hi: "सुबह (9 AM - 12 PM)" },
    startTime: "09:00",
    endTime: "12:00",
  },
  afternoon: {
    id: "afternoon",
    label: { en: "Afternoon (12 PM - 3 PM)", hi: "दोपहर (12 PM - 3 PM)" },
    startTime: "12:00",
    endTime: "15:00",
  },
  evening: {
    id: "evening",
    label: { en: "Evening (3 PM - 6 PM)", hi: "शाम (3 PM - 6 PM)" },
    startTime: "15:00",
    endTime: "18:00",
  },
} as const;

export type TimeSlotId = keyof typeof TIME_SLOTS;

// Default commission rate for collectors
export const DEFAULT_COMMISSION_RATE = 15;

// Default wallet balance
export const DEFAULT_WALLET_BALANCE = 0;

// Pickup status flow
export const PICKUP_STATUS_FLOW = {
  REQUESTED: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["ON_THE_WAY", "CANCELLED"],
  ON_THE_WAY: ["WEIGHING", "CANCELLED"],
  WEIGHING: ["PICKED", "CANCELLED"],
  PICKED: ["PAID"],
  PAID: [],
  CANCELLED: [],
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
  PAYOUT: "PAYOUT",
} as const;

// User roles
export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  COLLECTOR: "COLLECTOR",
  ADMIN: "ADMIN",
} as const;

