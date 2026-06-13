import * as LucideIcons from "lucide-react";

export const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  // ── Core financial ──────────────────────────
  "income": LucideIcons.TrendingUp,
  "expense": LucideIcons.TrendingDown,
  "balance": LucideIcons.Wallet,
  "cash": LucideIcons.Banknote,
  "coins": LucideIcons.Coins,
  "savings": LucideIcons.PiggyBank,
  "card": LucideIcons.CreditCard,
  "receipt": LucideIcons.Receipt,
  "bank": LucideIcons.Landmark,
  "loan": LucideIcons.HandCoins,

  // Analytics
  "analytics": LucideIcons.LineChart,
  "percentage": LucideIcons.Percent,

  // Transactions
  "transfer": LucideIcons.Repeat,
  "incoming": LucideIcons.ArrowDownLeft,
  "outgoing": LucideIcons.ArrowUpRight,

  // Categories (generic, reusable)
  "shopping": LucideIcons.ShoppingCart,
  "housing": LucideIcons.Home,
  "transport": LucideIcons.Car,
  "health": LucideIcons.Heart,
  "food": LucideIcons.Utensils,
  "entertainment": LucideIcons.Film,
  "gaming": LucideIcons.Gamepad2,
  "travel": LucideIcons.Plane,
  "gifts": LucideIcons.Gift,

  // Work / income source
  "salary": LucideIcons.Briefcase,
  "freelance": LucideIcons.Laptop,

  // Meta
  "category": LucideIcons.Tag,
  "folder": LucideIcons.Folder,
};
