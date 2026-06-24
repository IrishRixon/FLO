import { createClient } from "@/lib/supabase/server";
import { Budget, MonthlyBudget, MonthlySpending, Transaction, TransactionType, TransactionWithCategory } from "@/types";

export async function constraints() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser();

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const startOfMonth = `${year}-${String(month + 1).padStart(2, "0")}-01`
    const startOfNextMonth = `${year}-${String(month + 2).padStart(2, "0")}-01`

    return {
        supabase,
        user,
        startOfMonth,
        startOfNextMonth
    }
}

export async function getMonthlyBudgets(): Promise<MonthlyBudget | null> {
    try {
        const { startOfMonth, startOfNextMonth, supabase, user } = await constraints();

        const { data: budgets, error } = await supabase
            .from('monthly_budget')
            .select(`budget`)
            .eq('user_id', user?.id)
            .single<MonthlyBudget>()
        return budgets ?? null;
    } catch (error) {
        console.error(`error: ${error}`);
        return null;
    }
}

export async function getTransactions(): Promise<TransactionWithCategory[] | null> {
    try {
        const { startOfMonth, startOfNextMonth, supabase, user } = await constraints();

        const { data: transactions } = await supabase
            .from('transactions')
            .select('*, categories(name, icon, color)')
            .eq('user_id', user?.id)
            .gte('date', startOfMonth)
            .lt('date', startOfNextMonth)
            .order('created_at', { ascending: false })
            .overrideTypes<TransactionWithCategory[]>()

        return transactions ?? null;
    } catch (error) {
        console.error(`error: ${error}`);
        return null;
    }
}

export async function getMonthlySpending(): Promise<MonthlySpending[] | null> {
    try {
        const { supabase, user, startOfMonth, startOfNextMonth } = await constraints();

        const { data: monthlySpending } = await supabase
            .from('monthly_spending')
            .select('*')
            .eq('user_id', user?.id)
            .neq('category_name', 'Salary')
            .gte('month', startOfMonth)
            .lt('month', startOfNextMonth)
            .order('total', { ascending: false })
            .overrideTypes<MonthlySpending[]>()

        return monthlySpending ?? null;
    } catch (error) {
        console.log(`error: ${error}`);
        return null;
    }
}