"use client";

import { useState, useCallback } from "react";
import type { InsightData } from "@/types/insights";
import { InsightSummary } from "@/components/insights/InsightSummary";
import { InsightCard } from "@/components/insights/InsightCard";
import { SavingsCard } from "@/components/insights/SavingsCard";
import { GenerateButton } from "@/components/insights/GenerateButton";

interface InsightsClientProps {
  month: string
  cachedInsight: InsightData | null
  isCurrentMonth: boolean
  generatedAt: string | null
}

export function InsightsClient({
  month,
  cachedInsight,
  isCurrentMonth,
  generatedAt,
}: InsightsClientProps) {
  const [insightData, setInsightData] = useState<InsightData | null>(cachedInsight);
  const [generatedAtTime, setGeneratedAtTime] = useState<string | null>(generatedAt);

  const handleInsightGenerated = useCallback(
    (data: InsightData) => {
      setInsightData(data);
      setGeneratedAtTime(new Date().toISOString());
    },
    []
  );

  const hasData = insightData !== null && Array.isArray(insightData.insights);

  return (
    <>
      {/* Show generate button only for current month */}
      {isCurrentMonth && (
        <GenerateButton
          month={month}
          onInsightGenerated={handleInsightGenerated}
        />
      )}

      {/* Past months with no data */}
      {!isCurrentMonth && !hasData && (
        <div className="flex items-center justify-center h-40 text-[#8A8A8A] text-sm">
          No insights generated for this month
        </div>
      )}

      {/* Show insight data if available */}
      {hasData && (
        <>
          <InsightSummary
            summary={insightData.summary}
            month={month}
            generatedAt={generatedAtTime ?? new Date().toISOString()}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {insightData.insights.map((insight, index) => (
              <InsightCard
                key={`insight-${index}`}
                insight={insight}
                index={index}
              />
            ))}
          </div>

          <SavingsCard savingsOpportunity={insightData.savingsOpportunity} />

          {/* Forecast card */}
          <div className="bg-[#1A1A1E] rounded-xl border border-[rgba(255,255,255,0.06)] p-6">
            <h3 className="text-sm font-medium text-[#F0EFE9] mb-2">
              Next Month Forecast
            </h3>
            <p className="text-[13px] text-[#8A8A8A] leading-relaxed">
              {insightData.nextMonthForecast}
            </p>
          </div>
        </>
      )}

      {/* Empty state for current month with no cached data */}
      {isCurrentMonth && !hasData && (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <p className="text-[#8A8A8A] text-sm mb-2">
            No insights yet
          </p>
          <p className="text-[#8A8A8A] text-xs">
            Click the button above to generate AI-powered insights for this month.
          </p>
        </div>
      )}
    </>
  );
}