import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types";

export async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true })
      .overrideTypes<Category[]>();

    return categories ?? [];
  } catch (error) {
    console.error(`getAllCategories error: ${error}`);
    return [];
  }
}