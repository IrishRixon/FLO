import { PiggyBank } from "lucide-react";
import type { SavingsOpportunity } from "@/types/insights";

function formatPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SavingsCardProps {
  savingsOpportunity: SavingsOpportunity
}

export function SavingsCard({ savingsOpportunity }: SavingsCardProps) {
  return (
    <div
      className="bg-[#1A1A1E] rounded-xl border border-[rgba(255,255,255,0.06)] p-6 mb-6"
      style={{
        background: "linear-gradient(135deg, #1A1A1E 0%, rgba(78, 205, 196, 0.05) 100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[rgba(78,205,196,0.1)] flex items-center justify-center">
          <PiggyBank size={16} className="text-[#4ECDC4]" />
        </div>
        <span className="text-sm text-[#F0EFE9] font-medium">Savings Opportunity</span>
      </div>

      <p
        className="text-[28px] font-medium text-[#4ECDC4] mb-1"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {formatPeso(savingsOpportunity.amount)}
      </p>

      <p className="text-[12px] text-[#8A8A8A] mb-3">potential monthly savings</p>

      <p className="text-[14px] text-[#F0EFE9] leading-relaxed">
        {savingsOpportunity.tip}
      </p>
    </div>
  );
}