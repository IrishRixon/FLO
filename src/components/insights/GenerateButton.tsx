"use client";

import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import type { InsightData } from "@/types/insights";

interface GenerateButtonProps {
  month: string
  onInsightGenerated: (data: InsightData) => void
}

type LoadingStage = "analyzing" | "patterns" | "writing" | null;

const stageMessages: Record<NonNullable<LoadingStage>, string> = {
  analyzing: "Analyzing your spending...",
  patterns: "Finding patterns...",
  writing: "Writing your insight...",
};

export function GenerateButton({ month, onInsightGenerated }: GenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(null);
  const [error, setError] = useState<string | null>(null);

  const monthDate = new Date(month + "T00:00:00");
  const monthLabel = monthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoadingStage("analyzing");

    // Cycle through loading stages for visual feedback
    const stageTimer1 = setTimeout(() => setLoadingStage("patterns"), 2000);
    const stageTimer2 = setTimeout(() => setLoadingStage("writing"), 4000);

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate insight");
      }

      // Read the stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
      }

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      // Parse the full JSON response
      let data: InsightData;
      try {
        data = JSON.parse(fullResponse) as InsightData;

        // Basic validation
        if (!data.summary || !Array.isArray(data.insights)) {
          throw new Error("Invalid insight format");
        }
      } catch (parseErr) {
        // Log the raw response for debugging (truncated)
        console.error("Failed to parse insight JSON. Raw response:", fullResponse.slice(0, 500));
        throw new Error(
          "The AI generated an incomplete or malformed response. " +
          "Please try again — sometimes the AI needs a second attempt to get the format right."
        );
      }

      onInsightGenerated(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate insight";
      setError(message);
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      setLoading(false);
      setLoadingStage(null);
    }
  }, [month, onInsightGenerated]);

  return (
    <div className="mb-6">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-[#7C6EF7] hover:bg-[#6A5DE6] disabled:bg-[#7C6EF7]/50 text-white rounded-xl py-3 px-4 font-medium text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingStage ? stageMessages[loadingStage] : "Generating..."}</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span>Generate insight for {monthLabel}</span>
          </>
        )}
      </button>

      {/* Progress bar while loading */}
      {loading && (
        <div className="mt-3 h-1 bg-[#242428] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7C6EF7] rounded-full animate-pulse"
            style={{
              width: loadingStage === "analyzing" ? "30%" : loadingStage === "patterns" ? "60%" : "90%",
              transition: "width 1s ease-in-out",
            }}
          />
        </div>
      )}

      {error && (
        <div className="mt-3 text-center">
          <p className="text-[13px] text-[#FF6B6B] mb-2">{error}</p>
          <button
            onClick={handleGenerate}
            className="text-[13px] text-[#7C6EF7] hover:text-[#6A5DE6] underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}