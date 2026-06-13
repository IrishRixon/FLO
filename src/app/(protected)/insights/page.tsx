import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInsightForMonth } from "@/lib/supabase/queries/insights";
import { InsightsClient } from "./InsightsClient";
import { InsightSkeleton } from "@/components/insights/InsightSkeleton";
import { format, parseISO, addMonths, subMonths } from "date-fns";

function getCurrentMonthStr(): string {
  const now = new Date();
  return format(now, "yyyy-MM-01");
}

async function InsightsContent({ month }: { month: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Validate month format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(month)) {
    return <div className="p-8 text-[#FF6B6B]">Invalid month format</div>;
  }

  // Fetch cached insight
  const cachedInsight = await getInsightForMonth(user.id, month);

  // Calculate month info for navigation
  const monthDate = parseISO(month);
  const prevMonth = format(subMonths(monthDate, 1), "yyyy-MM-01");
  const nextMonth = format(addMonths(monthDate, 1), "yyyy-MM-01");
  const currentMonthStr = getCurrentMonthStr();
  const isCurrentMonth = month === currentMonthStr;

  // Check if this is a future month
  const isFutureMonth = monthDate > new Date();

  const monthLabel = format(monthDate, "MMMM yyyy");

  return (
    <div className="p-8">
      {/* Page header with month selector */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h2
            className="text-2xl font-medium"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Insights
          </h2>

          {/* Month navigation */}
          <div className="flex items-center gap-2">
            <a
              href={`/insights?month=${prevMonth}`}
              className="w-8 h-8 rounded-lg bg-[#242428] hover:bg-[#2A2A2E] flex items-center justify-center text-[#8A8A8A] hover:text-[#F0EFE9] transition-colors"
              aria-label="Previous month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </a>

            <span className="text-sm text-[#F0EFE9] font-medium min-w-[120px] text-center">
              {monthLabel}
            </span>

            <a
              href={`/insights?month=${nextMonth}`}
              className="w-8 h-8 rounded-lg bg-[#242428] hover:bg-[#2A2A2E] flex items-center justify-center text-[#8A8A8A] hover:text-[#F0EFE9] transition-colors"
              aria-label="Next month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
        </div>
        <p className="text-[#8A8A8A] text-sm">
          AI-powered financial insights and recommendations
        </p>
      </div>

      {isFutureMonth ? (
        <div className="flex items-center justify-center h-40 text-[#8A8A8A] text-sm">
          No data available for this month yet
        </div>
      ) : (
        <InsightsClient
          month={month}
          cachedInsight={cachedInsight?.content ? JSON.parse(cachedInsight.content) : null}
          isCurrentMonth={isCurrentMonth}
          generatedAt={cachedInsight?.created_at ?? null}
        />
      )}
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ month?: string }>
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const month = params?.month || getCurrentMonthStr();

  return (
    <Suspense fallback={<InsightSkeleton />}>
      <InsightsContent month={month} />
    </Suspense>
  );
}