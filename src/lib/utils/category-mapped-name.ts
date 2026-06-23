import { Category } from "@/types";

export function getCategoryByName(name: string, categories: Category[]): Category | undefined {
    return categories.find((category) => category.name === name);
}