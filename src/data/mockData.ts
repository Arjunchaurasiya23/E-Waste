import { WastePricing, TimeSlot, PickupRequest, User, Collector, Transaction, DailyAnalytics, AdminSettings } from "@/types";

// Default waste pricing
export const DEFAULT_WASTE_PRICING: WastePricing[] = [
  {
    type: "paper",
    pricePerKg: 14,
    minQuantity: 2,
    icon: "📰",
    label: { en: "Paper / Cardboard", hi: "कागज / गत्ता" },
  },
  {
    type: "plastic",
    pricePerKg: 10,
    minQuantity: 1,
    icon: "🥤",
    label: { en: "Plastic", hi: "प्लास्टिक" },
  },
  {
    type: "metal",
    pricePerKg: 35,
    minQuantity: 1,
    icon: "🔩",
    label: { en: "Metal / Iron", hi: "धातु / लोहा" },
  },
  {
    type: "ewaste",
    pricePerKg: 20,
    minQuantity: 0.5,
    icon: "📱",
    label: { en: "E-Waste", hi: "ई-कचरा" },
  },
  {
    type: "glass",
    pricePerKg: 5,
    minQuantity: 2,
    icon: "🍾",
    label: { en: "Glass", hi: "कांच" },
  },
  {
    type: "mixed",
    pricePerKg: 8,
    minQuantity: 5,
    icon: "♻️",
    label: { en: "Mixed Waste", hi: "मिश्रित कचरा" },
  },
];

// Time slots
export const TIME_SLOTS: TimeSlot[] = [
  { id: "morning", label: { en: "Morning (9 AM - 12 PM)", hi: "सुबह (9 AM - 12 PM)" }, startTime: "09:00", endTime: "12:00" },
  { id: "afternoon", label: { en: "Afternoon (12 PM - 3 PM)", hi: "दोपहर (12 PM - 3 PM)" }, startTime: "12:00", endTime: "15:00" },
  { id: "evening", label: { en: "Evening (3 PM - 6 PM)", hi: "शाम (3 PM - 6 PM)" }, startTime: "15:00", endTime: "18:00" },
];

// Demo users
export const DEMO_USERS: User[] = [
  {
    id: "customer-1",
    phone: "9876543210",
    name: "Rahul Sharma",
    role: "customer",
    address: {
      line1: "123, Green Park Colony",
      city: "Delhi",
      state: "Delhi",
      pincode: "110016",
    },
    pincode: "110016",
    createdAt: new Date("2024-01-15"),
    language: "en",
  },
  {
    id: "collector-1",
    phone: "9876543211",
    name: "Ramesh Kumar",
    role: "collector",
    pincode: "110016",
    createdAt: new Date("2024-01-10"),
    language: "hi",
  },
  {
    id: "admin-1",
    phone: "9876543212",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    language: "en",
  },
];

// Demo collectors
export const DEMO_COLLECTORS: Collector[] = [
  {
    id: "col-1",
    userId: "collector-1",
    name: "Ramesh Kumar",
    phone: "9876543211",
    status: "approved",
    pincodes: ["110016", "110017", "110018"],
    rating: 4.8,
    totalPickups: 156,
    totalEarnings: 45600,
    commissionRate: 15,
    joinedAt: new Date("2024-01-10"),
  },
  {
    id: "col-2",
    userId: "collector-2",
    name: "Suresh Yadav",
    phone: "9876543213",
    status: "approved",
    pincodes: ["110019", "110020"],
    rating: 4.5,
    totalPickups: 98,
    totalEarnings: 32400,
    commissionRate: 15,
    joinedAt: new Date("2024-02-01"),
  },
  {
    id: "col-3",
    userId: "collector-3",
    name: "Vikram Singh",
    phone: "9876543214",
    status: "pending",
    pincodes: ["110021"],
    rating: 0,
    totalPickups: 0,
    totalEarnings: 0,
    commissionRate: 15,
    joinedAt: new Date("2024-03-15"),
  },
];

// Demo pickup requests with multi-item support
export const DEMO_PICKUPS: PickupRequest[] = [
  {
    id: "pickup-1",
    customerId: "customer-1",
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    address: {
      line1: "123, Green Park Colony",
      city: "Delhi",
      state: "Delhi",
      pincode: "110016",
    },
    wasteType: "paper",
    estimatedWeight: 10,
    actualWeight: 12,
    estimatedAmount: 140,
    actualAmount: 168,
    items: [
      { id: "item-1", type: "paper", estimatedWeight: 10, pricePerKg: 14, estimatedAmount: 140, actualWeight: 12, actualAmount: 168 },
    ],
    totalEstimatedWeight: 10,
    totalActualWeight: 12,
    totalEstimatedAmount: 140,
    totalActualAmount: 168,
    status: "paid",
    scheduledDate: new Date("2024-03-18"),
    scheduledSlot: TIME_SLOTS[0],
    collectorId: "col-1",
    collectorName: "Ramesh Kumar",
    priceLockExpiresAt: new Date("2024-03-18T23:59:59"),
    createdAt: new Date("2024-03-17"),
    updatedAt: new Date("2024-03-18"),
    completedAt: new Date("2024-03-18"),
    paidAt: new Date("2024-03-18"),
  },
  {
    id: "pickup-2",
    customerId: "customer-1",
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    address: {
      line1: "123, Green Park Colony",
      city: "Delhi",
      state: "Delhi",
      pincode: "110016",
    },
    wasteType: "metal",
    estimatedWeight: 5,
    estimatedAmount: 175,
    items: [
      { id: "item-2", type: "metal", estimatedWeight: 3, pricePerKg: 35, estimatedAmount: 105 },
      { id: "item-3", type: "plastic", estimatedWeight: 2, pricePerKg: 10, estimatedAmount: 20 },
    ],
    totalEstimatedWeight: 5,
    totalEstimatedAmount: 125,
    status: "on_the_way",
    scheduledDate: new Date("2024-03-20"),
    scheduledSlot: TIME_SLOTS[1],
    collectorId: "col-1",
    collectorName: "Ramesh Kumar",
    priceLockExpiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    createdAt: new Date("2024-03-19"),
    updatedAt: new Date("2024-03-19"),
  },
  {
    id: "pickup-3",
    customerId: "customer-2",
    customerName: "Priya Verma",
    customerPhone: "9876543215",
    address: {
      line1: "45, Vasant Kunj",
      city: "Delhi",
      state: "Delhi",
      pincode: "110017",
    },
    wasteType: "plastic",
    estimatedWeight: 8,
    estimatedAmount: 80,
    items: [
      { id: "item-4", type: "plastic", estimatedWeight: null, pricePerKg: 10, estimatedAmount: null },
      { id: "item-5", type: "paper", estimatedWeight: null, pricePerKg: 14, estimatedAmount: null },
    ],
    assistedMode: true,
    status: "requested",
    scheduledDate: new Date("2024-03-21"),
    scheduledSlot: TIME_SLOTS[2],
    priceLockExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-20"),
  },
];

// Demo transactions
export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-1",
    userId: "customer-1",
    pickupId: "pickup-1",
    type: "credit",
    amount: 168,
    description: "Paper pickup - 12kg",
    status: "completed",
    createdAt: new Date("2024-03-18"),
  },
  {
    id: "txn-2",
    userId: "customer-1",
    type: "payout",
    amount: 150,
    description: "UPI Payout to 9876543210@paytm",
    status: "completed",
    upiId: "9876543210@paytm",
    createdAt: new Date("2024-03-19"),
  },
];

// Demo analytics with more data points for charts
export const DEMO_ANALYTICS: DailyAnalytics = {
  date: new Date(),
  totalPickups: 45,
  totalWeight: 892,
  totalRevenue: 15680,
  totalPayouts: 12450,
  byWasteType: [
    { type: "paper", weight: 320, revenue: 4480 },
    { type: "plastic", weight: 180, revenue: 1800 },
    { type: "metal", weight: 150, revenue: 5250 },
    { type: "ewaste", weight: 42, revenue: 840 },
    { type: "glass", weight: 120, revenue: 600 },
    { type: "mixed", weight: 80, revenue: 640 },
  ],
  topCollectors: [
    { id: "col-1", name: "Ramesh Kumar", pickups: 12, weight: 245 },
    { id: "col-2", name: "Suresh Yadav", pickups: 10, weight: 198 },
  ],
};

// Weekly analytics for charts
export const WEEKLY_ANALYTICS = [
  { day: "Mon", pickups: 32, weight: 580, revenue: 9800 },
  { day: "Tue", pickups: 28, weight: 490, revenue: 8200 },
  { day: "Wed", pickups: 45, weight: 720, revenue: 12400 },
  { day: "Thu", pickups: 38, weight: 620, revenue: 10800 },
  { day: "Fri", pickups: 52, weight: 890, revenue: 15200 },
  { day: "Sat", pickups: 67, weight: 1120, revenue: 19600 },
  { day: "Sun", pickups: 45, weight: 780, revenue: 13400 },
];

// Default admin settings
export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  minFreePickupWeight: 5,
  convenienceFee: 25,
  priceLockHours: 24,
  areaCoverage: [
    { pincode: "110016", enabled: true, collectorsCount: 3 },
    { pincode: "110017", enabled: true, collectorsCount: 2 },
    { pincode: "110018", enabled: true, collectorsCount: 1 },
    { pincode: "110019", enabled: false, collectorsCount: 0 },
    { pincode: "110020", enabled: false, collectorsCount: 0 },
  ],
};
