import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PATCH /api/budgets
 *
 * Adds an income amount to the current month's budget.
 * Body: { addAmount: number }
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { addAmount } = body;

    if (typeof addAmount !== "number" || addAmount <= 0) {
      return NextResponse.json(
        { error: "addAmount must be a positive number" },
        { status: 400 }
      );
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startOfMonth = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const startOfNextMonth = `${year}-${String(month + 2).padStart(2, "0")}-01`;

    // Fetch existing budget for this month
    const { data: existingBudget, error: fetchError } = await supabase
      .from("budgets")
      .select("id, amount")
      .eq("user_id", user.id)
      .gte("month", startOfMonth)
      .lt("month", startOfNextMonth)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows
      console.error("PATCH /api/budgets fetch error:", JSON.stringify(fetchError, null, 2));
      return NextResponse.json(
        { error: "Failed to fetch budget" },
        { status: 500 }
      );
    }

    if (existingBudget) {
      // Update existing budget
      const newAmount = existingBudget.amount + addAmount;

      const { error: updateError } = await supabase
        .from("budgets")
        .update({ amount: newAmount })
        .eq("id", existingBudget.id);

      if (updateError) {
        console.error("PATCH /api/budgets update error:", JSON.stringify(updateError, null, 2));
        return NextResponse.json(
          { error: "Failed to update budget" },
          { status: 500 }
        );
      }

      return NextResponse.json({ id: existingBudget.id, amount: newAmount });
    }

    // No budget exists yet — create one
    const { data: newBudget, error: insertError } = await supabase
      .from("budgets")
      .insert({
        user_id: user.id,
        amount: addAmount,
        month: startOfMonth,
      })
      .select()
      .single();

    if (insertError) {
      console.error("PATCH /api/budgets insert error:", JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { error: "Failed to create budget" },
        { status: 500 }
      );
    }

    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error("PATCH /api/budgets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}