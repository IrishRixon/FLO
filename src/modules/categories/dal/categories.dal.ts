import { createClient } from "@/lib/supabase/server";
import { constraints } from "@/modules/dashboard/dal/dashboard.dal";
import { BudgetVsActual, Category, CategoriesWithBudgetVsActual } from "@/types";

export async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true })
      .overrideTypes<Category[]>();

    return categories ?? [];
  } catch (error) {
    console.error(`getAllCategories error: ${error}`);
    return [];
  }
}

export async function getAllCategoriesWithBudgetVsActual(): Promise<CategoriesWithBudgetVsActual[]> {
  try {
    const { startOfMonth, startOfNextMonth, supabase, user } = await constraints();

    if (!user) return [];

    // 1. Fetch all categories for the user
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .or(`user_id.eq.${user.id}, user_id.is.null`)
      .order("name")
      .overrideTypes<Category[]>();

    if (categoriesError) {
      console.error("getAllCategoriesWithBudgetVsActual categories error:", categoriesError);
      return [];
    }

    if (!categories?.length) return [];

    // 2. Fetch budget_vs_actual for the current month
    const { data: budgets, error: budgetsError } = await supabase
      .from("budget_vs_actual")
      .select("*")
      .eq("user_id", user.id )
      .gte("month", startOfMonth)
      .lt("month", startOfNextMonth)
      .in("category_id", categories.map((c) => c.id))
      .overrideTypes<BudgetVsActual[]>();

    if (budgetsError) {
      console.error("getAllCategoriesWithBudgetVsActual budgets error:", budgetsError);
      return [];
    }

    // 3. Merge: index budget_vs_actual rows by category_id
    const budgetMap = new Map(budgets?.map((b) => [b.category_id, b]) ?? []);

    const result = categories.map((cat) => ({
      ...cat,
      budgetVsActual: budgetMap.get(cat.id) ?? {
        user_id: user.id,
        category_id: cat.id,
        category_name: cat.name,
        category_icon: cat.icon,
        category_color: cat.color,
        month: startOfMonth,
        budget_amount: 0,
        spent_amount: 0,
      },
    }));

    return result;
  } catch (error) {
    console.error(`getAllCategoriesWithBudgetVsActual error: ${error}`);
    return [];
  }
}