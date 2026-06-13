"use client";

import { motion } from "motion/react";
import { CheckCircle, AlertTriangle, Lightbulb, Info } from "lucide-react";
import type { Insight } from "@/types/insights";

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  tip: Lightbulb,
  neutral: Info,
} as const;

const colorMap = {
  success: {
    border: "#4ECDC4",
    icon: "#4ECDC4",
    bg: "rgba(78, 205, 196, 0.1)",
  },
  warning: {
    border: "#FF6B6B",
    icon: "#FF6B6B",
    bg: "rgba(255, 107, 107, 0.1)",
  },
  tip: {
    border: "#7C6EF7",
    icon: "#7C6EF7",
    bg: "rgba(124, 110, 247, 0.1)",
  },
  neutral: {
    border: "#8A8A8A",
    icon: "#8A8A8A",
    bg: "rgba(138, 138, 138, 0.1)",
  },
} as const;

function formatPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface InsightCardProps {
  insight: Insight
  index: number
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const Icon = iconMap[insight.type];
  const colors = colorMap[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-[#1A1A1E] rounded-xl border border-[rgba(255,255,255,0.06)] p-5 flex items-start gap-4 relative"
      style={{ borderLeft: `3px solid ${colors.border}` }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: colors.bg }}
      >
        <Icon size={18} style={{ color: colors.icon }} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-semibold text-[#F0EFE9] mb-1">
          {insight.title}
        </h4>
        <p className="text-[13px] text-[#8A8A8A] leading-relaxed">
          {insight.body}
        </p>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {insight.category && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#242428] text-[#8A8A8A]">
              {insight.category}
            </span>
          )}
          {insight.amount !== null && (
            <span
              className="text-[11px] px-2 py-0.5 rounded-full ml-auto"
              style={{
                backgroundColor: colors.bg,
                color: colors.icon,
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              {formatPeso(insight.amount)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}