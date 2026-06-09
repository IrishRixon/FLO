import { createClient } from "@/lib/supabase/server";
import { Budgets } from "../type/dashboard.type";

export async function getBudgets(): Promise<Budgets | null> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser();

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()
        const startOfMonth = new Date(year, month, 1).toISOString().split('T')[0]
        const startOfNextMonth = new Date(year, month + 1, 1).toISOString().split('T')[0]

        const { data: budgets, error } = await supabase
            .from('budgets')
            .select(`*`)
            .gte('month', startOfMonth)
            .eq('user_id', user?.id)
            .lt('month', startOfNextMonth)
            .order('amount', { ascending: false })
            .single<Budgets>()

        return budgets ?? null;
    } catch (error) {
        console.error("error");
        return null;
    }
}