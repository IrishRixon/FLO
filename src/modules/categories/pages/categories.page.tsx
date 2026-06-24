"use client";

import { CategoryCard } from "@/app/components/category-card";
import { DashboardCard } from "@/app/components/dashboard-card";
import { CategoriesWithBudgetVsActual, Category } from "@/types";

interface Props {
    categories: CategoriesWithBudgetVsActual[];
}

export function CategoriesPage({ categories }: Props) {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>Categories</h2>
                <p className="text-text-secondary text-sm">Track and set budget in each categories</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Budget",
            value: 4,
            sub: "this month",
            color: "var(--primary)",
          },
          {
            label: "Total Spent",
            value: 4,
            sub: "this month",
            color: "#FF6B6B",
          },
          {
            label: "Over Budget",
            value: 0,
            sub: "all clear",
            color: "#4ADE80",
          },
          {
            label: "On Track",
            value: 1,
            sub: `of ${categories.length} categories`,
            color: "#4ADE80",
          },
        ].map((stat) => (
          <DashboardCard
            key={stat.label}
            className="bg-surface border border-border rounded-2xl"
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
        ))}
      </div>
            <div className="grid grid-cols-4 gap-4">
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </div>
    )
}