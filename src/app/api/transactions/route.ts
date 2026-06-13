import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TransactionWithCategory } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 20));
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

    return NextResponse.json({
      transactions: transactions ?? [],
      total: count ?? 0,
    });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { category_id, type, amount, description, date, notes, ai_category_suggestion, ai_confidence } = body;

    if (!category_id || !type || !amount || !description || !date) {
      return NextResponse.json(
        { error: "Missing required fields: category_id, type, amount, description, date" },
        { status: 400 }
      );
    }

    if (!["expense", "income"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'expense' or 'income'" },
        { status: 400 }
      );
    }

    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        category_id,
        type,
        amount,
        description,
        date,
        notes: notes || null,
        ai_category_suggestion: ai_category_suggestion || null,
        ai_confidence: ai_confidence || null,
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/transactions insert error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to create transaction", details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}