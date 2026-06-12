import {
  Wallet, PiggyBank, CreditCard, Banknote, Coins,
  TrendingUp, TrendingDown, LineChart, Percent,
  Receipt, Landmark, HandCoins,

  ShoppingCart, Home, Car, Heart, Utensils,
  Film, Gamepad2, Plane, Gift,

  Briefcase, Laptop,

  ArrowUpRight, ArrowDownLeft, Repeat,

  Tag, Folder
} from "lucide-react";

export const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {

  // ── Food & Drink ──────────────────────────
   // Core financial
  "income": TrendingUp,
  "expense": TrendingDown,
  "balance": Wallet,
  "cash": Banknote,
  "coins": Coins,
  "savings": PiggyBank,
  "card": CreditCard,
  "receipt": Receipt,
  "bank": Landmark,
  "loan": HandCoins,

  // Analytics
  "analytics": LineChart,
  "percentage": Percent,

  // Transactions
  "transfer": Repeat,
  "incoming": ArrowDownLeft,
  "outgoing": ArrowUpRight,

  // Categories (generic, reusable)
  "shopping": ShoppingCart,
  "housing": Home,
  "transport": Car,
  "health": Heart,
  "food": Utensils,
  "entertainment": Film,
  "gaming": Gamepad2,
  "travel": Plane,
  "gifts": Gift,

  // Work / income source
  "salary": Briefcase,
  "freelance": Laptop,

  // Meta
  "category": Tag,
  "folder": Folder,
};