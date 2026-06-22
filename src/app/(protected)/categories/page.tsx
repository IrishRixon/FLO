import { CategoriesPage } from "@/modules/categories/pages/categories.page";
import { getAllCategoriesWithBudgetVsActual } from "@/modules/categories/dal/categories.dal";

export default async function Page() {
  const categories = await getAllCategoriesWithBudgetVsActual();
  
  return (
    <CategoriesPage categories={categories} />
  );
}