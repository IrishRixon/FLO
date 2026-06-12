import { createClient } from "@/lib/supabase/server";
import { TransactionWithCategory } from "@/types";

export async function getAllTransactions(
  page: number = 1,
  pageSize: number = 20
): Promise<{ transactions: TransactionWithCategory[]; total: number }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { transactions: [], total: 0 };

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get total count
    const { count } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get paginated data
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*, categories(id, name, icon, color)")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .range(from, to)
      .overrideTypes<TransactionWithCategory[]>();

    return { transactions: transactions ?? [], total: count ?? 0 };
  } catch (error) {
    console.error(`getAllTransactions error: ${error}`);
    return { transactions: [], total: 0 };
  }
}