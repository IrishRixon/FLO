// ============================================================
// Flo Finance Tracker — Shared TypeScript Types
// All types match the Supabase database schema exactly.
// ============================================================

/** Transaction direction */
export type TransactionType = 'expense' | 'income';

/** Row from `profiles` table */
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

/** Row from `categories` table */
export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
  type: TransactionType;
  created_at: string;
}

/** Row from `transactions` table */
export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  notes: string | null;
  date: string;
  ai_category_suggestion: string | null;
  ai_confidence: number | null;
  created_at: string;
  updated_at: string;
}

/** Transaction joined with its category (for display) */
export interface TransactionWithCategory extends Transaction {
  categories: Category;
}

export interface CategoriesWithBudgetVsActual extends Category {
  budgetVsActual: BudgetVsActual;
}

/** Row from `budgets` table */
export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  month: string;
  created_at: string;
  updated_at: string;
}

/** Budget joined with its category (for display) */
export interface BudgetWithCategory extends Budget {
  category: Category;
}

/** Row from `ai_insights` table */
export interface AIInsight {
  id: string;
  user_id: string;
  month: string;
  content: string;
  created_at: string;
}

// ============================================================
// View types (match Supabase views)
// ============================================================

/** Row from `monthly_spending` view */
export interface MonthlySpending {
  user_id: string;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  month: string;
  total: number;
}

/** Row from `budget_vs_actual` view */
export interface BudgetVsActual {
  user_id: string;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  month: string;
  budget_amount: number;
  spent_amount: number;
}

// ============================================================
// Form / input types
// ============================================================

/** Shape for creating a new transaction */
export interface CreateTransactionInput {
  category_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  notes?: string;
  date: string;
}

/** Shape for creating / updating a budget */
export interface CreateBudgetInput {
  category_id: string;
  amount: number;
  month: string;
}

// ============================================================
// UI helper types
// ============================================================

/** Navigation link definition */
export interface NavLink {
  href: string;
  label: string;
  icon: string;
}

/** Grouped transactions for display (by date) */
export interface TransactionGroup {
  dateLabel: string;
  transactions: TransactionWithCategory[];
}

/** AI categorization result from Transformers.js */
export interface AICategorySuggestion {
  category: string;
  confidence: number;
}

/** Summary card data for the dashboard */
export interface DashboardSummary {
  totalSpent: number;
  totalIncome: number;
  biggestCategory: {
    name: string;
    icon: string;
    color: string;
    amount: number;
  } | null;
  daysLeftInMonth: number;
  dailyRemainingBudget: number;
  totalBudget: number;
}

/** Offline sync queue item */
export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  table: 'transactions' | 'budgets';
  payload: Record<string, unknown>;
  created_at: string;
}
