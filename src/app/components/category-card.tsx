"use client";

import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { iconMap } from "@/iconlist/icon-list";
import { CategoriesWithBudgetVsActual } from "@/types";
import { Pencil, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { EditBudgetDialog } from "@/app/components/edit-budget-dialog";

function getStatus(spent: number, budget: number): "ok" | "warning" | "over" {
  if (budget === 0) return "ok";
  const pct = spent / budget;
  if (pct > 1) return "over";
  if (pct > 0.75) return "warning";
  return "ok";
}

function formatMoney(amount: number): string {
  return `₱${Math.abs(amount).toLocaleString()}`;
}

interface CategoryCardProps {
  category: CategoriesWithBudgetVsActual;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [editCategory, setEditCategory] = useState<CategoriesWithBudgetVsActual | null>(null);
  const Icon = iconMap[category.icon];
  const status = getStatus(category.budgetVsActual.spent_amount, category.budgetVsActual.budget_amount);
  const pct = Math.min((category.budgetVsActual.spent_amount / category.budgetVsActual.budget_amount) * 100, 100);
  const remaining = category.budgetVsActual.budget_amount - category.budgetVsActual.spent_amount;

  const spentColor =
    status === "over" ? "#FF6B6B" : status === "warning" ? "#FFB84D" : category.color;

  return (
    <Card className="group relative pt-5">
      <CardContent>
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {Icon && <Icon size={18} style={{ color: category.color }} />}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{category.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Budget{" "}
                <span style={{ fontFamily: "var(--font-mono)" }}>
                  {formatMoney(category.budgetVsActual.budget_amount)}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditCategory(category)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
            aria-label={`Edit budget for ${category.name}`}
          >
            <Pencil size={14} />
          </button>
        </div>

        {/* Progress bar — neutral/muted color, not the category color */}
        <div className="mb-3">
          <Progress
            value={pct}
            className={`h-1.5 [&>[data-slot=progress-indicator]]:bg-muted-foreground/30 ${status === "over" ? "[&>[data-slot=progress-indicator]]:bg-destructive" : status === "warning" ? "[&>[data-slot=progress-indicator]]:bg-[#FFB84D]" : "[&>[data-slot=progress-indicator]]:bg-primary"}`}
          />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatMoney(category.budgetVsActual.spent_amount)}
            </span>
            <span className="text-xs text-muted-foreground ml-1">spent</span>
          </div>

          <div className="flex items-center gap-1.5">
            {status === "over" && (
              <>
                <AlertTriangle size={12} className="text-destructive" />
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "#FF6B6B" }}
                >
                  {formatMoney(Math.abs(remaining))} over
                </span>
              </>
            )}
            {status === "warning" && (
              <>
                <TrendingUp size={12} style={{ color: "#FFB84D" }} />
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-mono)", color: "#FFB84D" }}
                >
                  {formatMoney(remaining)} left
                </span>
              </>
            )}
            {status === "ok" && remaining > 0 && (
              <>
                <TrendingDown size={12} className="text-muted-foreground" />
                <span
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {formatMoney(remaining)} left
                </span>
              </>
            )}
            {status === "ok" && remaining === 0 && (
              <span className="text-xs text-muted-foreground">On target</span>
            )}
          </div>
        </div>
      </CardContent>

      <EditBudgetDialog
        category={editCategory}
        open={editCategory !== null}
        onClose={() => setEditCategory(null)}
      />
    </Card>
  );
}
