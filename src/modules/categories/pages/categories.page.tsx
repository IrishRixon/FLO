"use client";

import { CategoryCard } from "@/app/components/category-card";
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

            <div className="grid grid-cols-3 gap-4">
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} onEdit={() => {}}/>
                ))}
            </div>
        </div>
    )
}