import { createClient } from "@/lib/supabase/server";
import type { CachedInsight, InsightData } from "@/types/insights";

export async function getInsightForMonth(
  userId: string,
  monthStr: string
): Promise<CachedInsight | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("user_id", userId)
      .eq("month", monthStr)
      .single<CachedInsight>();

    if (error) {
      if (error.code === "PGRST116") return null; // no rows
      console.error("getInsightForMonth error:", JSON.stringify(error, null, 2));
      return null;
    }

    return data;
  } catch (error) {
    console.error("getInsightForMonth exception:", error);
    return null;
  }
}

export async function saveInsight(
  userId: string,
  monthStr: string,
  content: InsightData
): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("ai_insights").upsert(
      {
        user_id: userId,
        month: monthStr,
        content,
      },
      {
        onConflict: "user_id, month",
        ignoreDuplicates: false,
      }
    );

    if (error) {
      console.error("saveInsight error:", JSON.stringify(error, null, 2));
    }
  } catch (error) {
    console.error("saveInsight exception:", error);
  }
}

/** Row shape returned by monthly_spending view */
export interface MonthlySpendingRow {
  user_id: string
  category_name: string
  category_icon: string
  category_color: string
  type: string
  month: string
  total: number
  transaction_count: number
}

export async function getSpendingDataForMonth(
  userId: string,
  monthStr: string
): Promise<MonthlySpendingRow[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("monthly_spending")
      .select("*")
      .eq("type", "expense")
      .eq("user_id", userId)
      .eq("month", monthStr)
      .overrideTypes<MonthlySpendingRow[]>();

    if (error) {
      console.error("getSpendingDataForMonth error:", JSON.stringify(error, null, 2));
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("getSpendingDataForMonth exception:", error);
    return [];
  }
}

/** Row shape returned by budget_vs_actual view */
export interface BudgetVsActualRow {
  user_id: string
  category_name: string
  category_icon: string
  category_color: string
  month: string
  budget_amount: number
  spent_amount: number
  remaining: number
}

export async function getBudgetVsActualForMonth(
  userId: string,
  monthStr: string
): Promise<BudgetVsActualRow[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("budget_vs_actual")
      .select("*")
      .eq("user_id", userId)
      .eq("month", monthStr)
      .overrideTypes<BudgetVsActualRow[]>();

    if (error) {
      console.error("getBudgetVsActualForMonth error:", JSON.stringify(error, null, 2));
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("getBudgetVsActualForMonth exception:", error);
    return [];
  }
}

export interface IncomeSource {
  description: string
  amount: number
}

export interface IncomeData {
  total: number
  sources: IncomeSource[]
}

export async function getIncomeForMonth(
  userId: string,
  startDate: string,
  endDate: string
): Promise<IncomeData> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("transactions")
      .select("description, amount")
      .eq("user_id", userId)
      .eq("type", "income")
      .gte("date", startDate)
      .lte("date", endDate)
      .overrideTypes<{ description: string; amount: number }[]>();

    if (error) {
      console.error("getIncomeForMonth error:", JSON.stringify(error, null, 2));
      return { total: 0, sources: [] };
    }

    const transactions = data ?? [];
    const total = transactions.reduce((sum: number, t: { description: string; amount: number }) => sum + t.amount, 0);

    return {
      total,
      sources: transactions.map((t: { description: string; amount: number }) => ({
        description: t.description,
        amount: t.amount,
      })),
    };
  } catch (error) {
    console.error("getIncomeForMonth exception:", error);
    return { total: 0, sources: [] };
  }
}

export interface TopTransaction {
  description: string
  amount: number
  category_name: string | null
  date: string
}

export async function getTopTransactionsForMonth(
  userId: string,
  startDate: string,
  endDate: string
): Promise<TopTransaction[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("transactions")
      .select("description, amount, date, categories(name)")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("amount", { ascending: false })
      .limit(5)
      .overrideTypes<{ description: string; amount: number; date: string; categories: { name: string } | null }[]>();

    if (error) {
      console.error("getTopTransactionsForMonth error:", JSON.stringify(error, null, 2));
      return [];
    }

    return (data ?? []).map((t: { description: string; amount: number; date: string; categories: { name: string } | null }) => ({
      description: t.description,
      amount: t.amount,
      category_name: t.categories?.name ?? null,
      date: t.date,
    }));
  } catch (error) {
    console.error("getTopTransactionsForMonth exception:", error);
    return [];
  }
}

export interface PreviousMonthSpending {
  total: number
  byCategory: Record<string, number>
}

export async function getPreviousMonthSpending(
  userId: string,
  prevMonthStr: string
): Promise<PreviousMonthSpending> {
  try {
    const supabase = await createClient();

    // Get the start and end of the previous month
    const prevDate = new Date(prevMonthStr + "T00:00:00");
    const year = prevDate.getFullYear();
    const month = prevDate.getMonth();
    const startOfPrev = new Date(year, month, 1).toISOString().split("T")[0];
    const startOfNext = new Date(year, month + 1, 1).toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("monthly_spending")
      .select("*")
      .eq("user_id", userId)
      .gte("month", startOfPrev)
      .lt("month", startOfNext)
      .overrideTypes<MonthlySpendingRow[]>();

    if (error) {
      console.error("getPreviousMonthSpending error:", JSON.stringify(error, null, 2));
      return { total: 0, byCategory: {} };
    }

    const rows = data ?? [];
    const byCategory: Record<string, number> = {};
    let total = 0;

    for (const row of rows) {
      byCategory[row.category_name] = row.total;
      total += row.total;
    }

    return { total, byCategory };
  } catch (error) {
    console.error("getPreviousMonthSpending exception:", error);
    return { total: 0, byCategory: {} };
  }
}