import { Recycle, Home, User, IndianRupee, Truck, Settings, BarChart3, Users, MapPin, Package, Wallet, History, Plus, ArrowLeft, Check, X, Phone, Clock, Calendar, ChevronRight, AlertCircle, LogOut, Languages, Menu, Bell, Search, Filter, Edit, Trash, Eye, Info, RefreshCcw, ShoppingBag, Star, TrendingUp, Lock, Unlock, Weight, CircleDollarSign } from "lucide-react";

export const Icons = {
  // Navigation
  home: Home,
  user: User,
  settings: Settings,
  logout: LogOut,
  menu: Menu,
  back: ArrowLeft,
  chevronRight: ChevronRight,
  
  // App specific
  recycle: Recycle,
  rupee: IndianRupee,
  truck: Truck,
  analytics: BarChart3,
  users: Users,
  location: MapPin,
  package: Package,
  wallet: Wallet,
  history: History,
  bag: ShoppingBag,
  weight: Weight,
  
  // Actions
  plus: Plus,
  check: Check,
  close: X,
  edit: Edit,
  delete: Trash,
  view: Eye,
  search: Search,
  filter: Filter,
  refresh: RefreshCcw,
  
  // Status & Info
  phone: Phone,
  clock: Clock,
  calendar: Calendar,
  alert: AlertCircle,
  bell: Bell,
  language: Languages,
  info: Info,
  star: Star,
  trending: TrendingUp,
  lock: Lock,
  unlock: Unlock,
  money: CircleDollarSign,
};

export type IconName = keyof typeof Icons;
