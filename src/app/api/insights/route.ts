import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getInsightForMonth,
  getSpendingDataForMonth,
  getBudgetVsActualForMonth,
  getIncomeForMonth,
  getTopTransactionsForMonth,
  getPreviousMonthSpending,
} from "@/lib/supabase/queries/insights";
import {
  buildInsightPrompt,
  generateInsightStream,
  parseInsightResponse,
  type CategorySpend,
} from "@/lib/ai/insights";
import { saveInsight } from "@/lib/supabase/queries/insights";
import { format } from "date-fns";
import { getMonthlyBudgets } from "@/modules/dashboard/dal/dashboard.dal";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { month } = body;

    // Validate month format: YYYY-MM-DD (first of month)
    if (!month || typeof month !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "Invalid month format" }, { status: 422 });
    }

    const monthDate = new Date(month + "T00:00:00");

    // Check for cached insight (less than 24 hours old)
    const cached = await getInsightForMonth(user.id, month);
    if (cached) {
      const created = new Date(cached.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 24) {
        const parsed = JSON.parse(cached.content);
        return NextResponse.json(parsed);
      }
    }

    // Calculate month info
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const monthName = monthNames[monthDate.getMonth()];
    const year = monthDate.getFullYear();
    const daysInMonth = new Date(year, monthDate.getMonth() + 1, 0).getDate();
    const today = new Date();
    const daysElapsed = Math.min(today.getDate(), daysInMonth);

    // Calculate date range for the month
    const startDate = month;
    const endDate = format(
      new Date(year, monthDate.getMonth() + 1, 0),
      "yyyy-MM-dd"
    );

    // Previous month string
    const prevMonthDate = new Date(year, monthDate.getMonth() - 1, 1);
    const prevMonthStr = format(prevMonthDate, "yyyy-MM-01");

    // Gather all data in parallel
    const [spendingData, budgetData, incomeData, topTransactions, prevMonthSpending, monthlyBudget] =
      await Promise.all([
        getSpendingDataForMonth(user.id, month),
        getBudgetVsActualForMonth(user.id, month),
        getIncomeForMonth(user.id, startDate, endDate),
        getTopTransactionsForMonth(user.id, startDate, endDate),
        getPreviousMonthSpending(user.id, prevMonthStr),
        getMonthlyBudgets()
      ]);

    // Build category spend with budget info
    const budgetMap = new Map<string, number>();
    for (const b of budgetData) {
      budgetMap.set(b.category_name, b.budget_amount);
    }

    const byCategory: CategorySpend[] = spendingData.map((s) => ({
      name: s.category_name,
      spent: s.total,
      budget: budgetMap.get(s.category_name) ?? null,
      icon: s.category_icon,
      color: s.category_color,
    }));

    const totalSpent = spendingData.reduce((sum: number, s: { total: number }) => sum + s.total, 0);
    const totalBudget = budgetData.reduce((sum: number, b: { budget_amount: number }) => sum + b.budget_amount, 0);
    const getMonthlyBudget = monthlyBudget?.budget;

    const promptData = {
      month: {
        name: monthName,
        year,
        daysInMonth,
        daysElapsed,
        monthlySpendingLimit: getMonthlyBudget || 0
      },
      currency: "PHP",
      income: incomeData,
      spending: {
        total: totalSpent,
        budget: totalBudget,
        byCategory,
      },
      topTransactions,
      previousMonth: prevMonthSpending,
    };

    // Generate the stream
    const stream = await generateInsightStream(promptData);

    // Read the full stream to get the complete response
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;
            controller.enqueue(value);
          }
          controller.close();

          // After streaming completes, parse and save
          try {
            const parsed = parseInsightResponse(fullResponse);
            await saveInsight(user.id, month, parsed);
          } catch (parseError) {
            console.error("Failed to save insight:", parseError);
            // Don't fail the response if saving fails — user already saw the stream
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("POST /api/insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}