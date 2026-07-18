"use client";

import { useState } from "react";
import { CategoryCard } from "@/app/components/category-card";
import { DashboardCard } from "@/app/components/dashboard-card";
import { Button } from "@/app/components/ui/button";
import { IconPickerDialog } from "@/app/components/icon-picker-dialog";
import { CategoriesWithBudgetVsActual, Category } from "@/types";
import { Plus } from "lucide-react";

interface Props {
  categories: CategoriesWithBudgetVsActual[];
}

export function CategoriesPage({ categories }: Props) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const totalBudget = categories.reduce((acc, category) => acc + category.budgetVsActual.budget_amount, 0);
  const totalSpent = categories.reduce((acc, category) => acc + category.budgetVsActual.spent_amount, 0);
  const overBudget = categories.filter((category) => category.budgetVsActual.spent_amount > category.budgetVsActual.budget_amount).length;
  const onTrack = categories.filter((category) => category.budgetVsActual.spent_amount <= category.budgetVsActual.budget_amount && category.budgetVsActual.budget_amount > 0).length;
  const percentage = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <div className="mb-8">
          <h2 className="text-2xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>Categories</h2>
          <p className="text-text-secondary text-sm">Track and set budget in each categories</p>
        </div>
        <Button
          className="h-10 rounded-lg px-6"
          variant={"default"}
          onClick={() => setIconPickerOpen(true)}
        >
          <Plus className="mr-2" size={18} />
          Create Category
        </Button>
      </div>

      <IconPickerDialog
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
      />

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Budget",
            value: totalBudget,
            sub: "this month",
            color: "var(--primary)",
          },
          {
            label: "Total Spent",
            value: totalSpent,
            sub: `${percentage}% of budget`,
            color: "#4ADE80",
          },
          {
            label: "Over Budget",
            value: overBudget,
            sub: `of ${categories.length} categories`,
            color: "#FF6B6B",
          },
          {
            label: "On Track",
            value: onTrack,
            sub: `of ${categories.length} categories`,
            color: "#4ADE80",
          },
        ].map((stat) => {
          const isLabelSpend = stat.label.toLowerCase() === "total spent";
          const overSpent = isLabelSpend ? totalSpent > totalBudget : false;
          return (
            <DashboardCard
              key={stat.label}
              className={`${overSpent ? "bg-destructive/10" : "bg-surface"} border ${overSpent ? "border-destructive/20" : "border-border"} rounded-2xl `}
            >
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                {stat.label}
              </p>
              <p
                className="text-xl font-semibold mb-0.5"
                style={{ fontFamily: "var(--font-mono)", color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </DashboardCard>
          )
        })}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}