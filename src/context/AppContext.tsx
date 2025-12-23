import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole, PickupRequest, WastePricing, Transaction, Collector, WasteBagItem, AdminSettings } from "@/types";
import { DEMO_USERS, DEMO_PICKUPS, DEFAULT_WASTE_PRICING, DEMO_TRANSACTIONS, DEMO_COLLECTORS, DEFAULT_ADMIN_SETTINGS } from "@/data/mockData";

type Language = "en" | "hi";

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, role: UserRole) => void;
  logout: () => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, hi: string) => string;
  
  // Pricing
  wastePricing: WastePricing[];
  updatePricing: (type: string, price: number) => void;
  
  // Pickups
  pickups: PickupRequest[];
  addPickup: (pickup: Omit<PickupRequest, "id" | "createdAt" | "updatedAt">) => void;
  updatePickup: (id: string, updates: Partial<PickupRequest>) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void;
  
  // Collectors
  collectors: Collector[];
  updateCollector: (id: string, updates: Partial<Collector>) => void;
  
  // Wallet
  walletBalance: number;
  
  // Waste Bag
  wasteBag: WasteBagItem[];
  addToWasteBag: (item: Omit<WasteBagItem, "id">) => void;
  updateWasteBagItem: (id: string, updates: Partial<WasteBagItem>) => void;
  removeFromWasteBag: (id: string) => void;
  clearWasteBag: () => void;
  getWasteBagTotals: () => { totalWeight: number | null; totalAmount: number | null; itemCount: number };
  
  // Admin Settings
  adminSettings: AdminSettings;
  updateAdminSettings: (updates: Partial<AdminSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [wastePricing, setWastePricing] = useState<WastePricing[]>(DEFAULT_WASTE_PRICING);
  const [pickups, setPickups] = useState<PickupRequest[]>(DEMO_PICKUPS);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [collectors, setCollectors] = useState<Collector[]>(DEMO_COLLECTORS);
  const [wasteBag, setWasteBag] = useState<WasteBagItem[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);

  const login = (phone: string, role: UserRole) => {
    let existingUser = DEMO_USERS.find(u => u.role === role);
    
    if (!existingUser) {
      existingUser = {
        id: `${role}-${Date.now()}`,
        phone,
        name: role === "customer" ? "New Customer" : role === "collector" ? "New Collector" : "Admin",
        role,
        createdAt: new Date(),
        language,
      };
    }
    
    setUser({ ...existingUser, phone });
  };

  const logout = () => {
    setUser(null);
  };

  const t = (en: string, hi: string) => (language === "en" ? en : hi);

  const updatePricing = (type: string, price: number) => {
    setWastePricing(prev => 
      prev.map(p => p.type === type ? { ...p, pricePerKg: price } : p)
    );
  };

  const addPickup = (pickup: Omit<PickupRequest, "id" | "createdAt" | "updatedAt">) => {
    const newPickup: PickupRequest = {
      ...pickup,
      id: `pickup-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPickups(prev => [newPickup, ...prev]);
  };

  const updatePickup = (id: string, updates: Partial<PickupRequest>) => {
    setPickups(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)
    );
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      createdAt: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateCollector = (id: string, updates: Partial<Collector>) => {
    setCollectors(prev =>
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  };

  // Waste Bag functions
  const addToWasteBag = (item: Omit<WasteBagItem, "id">) => {
    const newItem: WasteBagItem = {
      ...item,
      id: `bag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setWasteBag(prev => [...prev, newItem]);
  };

  const updateWasteBagItem = (id: string, updates: Partial<WasteBagItem>) => {
    setWasteBag(prev =>
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const removeFromWasteBag = (id: string) => {
    setWasteBag(prev => prev.filter(item => item.id !== id));
  };

  const clearWasteBag = () => {
    setWasteBag([]);
  };

  const getWasteBagTotals = () => {
    const hasUnknownWeight = wasteBag.some(item => item.estimatedWeight === null);
    
    if (hasUnknownWeight) {
      return {
        totalWeight: null,
        totalAmount: null,
        itemCount: wasteBag.length,
      };
    }
    
    return {
      totalWeight: wasteBag.reduce((sum, item) => sum + (item.estimatedWeight || 0), 0),
      totalAmount: wasteBag.reduce((sum, item) => sum + (item.estimatedAmount || 0), 0),
      itemCount: wasteBag.length,
    };
  };

  // Admin settings
  const updateAdminSettings = (updates: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...updates }));
  };

  // Calculate wallet balance for current user
  const walletBalance = user 
    ? transactions
        .filter(t => t.userId === user.id && t.status === "completed")
        .reduce((acc, t) => {
          if (t.type === "credit") return acc + t.amount;
          if (t.type === "debit" || t.type === "payout") return acc - t.amount;
          return acc;
        }, 0)
    : 0;

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      language,
      setLanguage,
      t,
      wastePricing,
      updatePricing,
      pickups,
      addPickup,
      updatePickup,
      transactions,
      addTransaction,
      collectors,
      updateCollector,
      walletBalance,
      wasteBag,
      addToWasteBag,
      updateWasteBagItem,
      removeFromWasteBag,
      clearWasteBag,
      getWasteBagTotals,
      adminSettings,
      updateAdminSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
