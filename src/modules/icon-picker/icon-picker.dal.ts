import { createClient } from "@/lib/supabase/server";

export async function postCategory(
    name: string,
    selectedIcon: string,
    colorHex: string,
    type: "expense" | "income"
) {

    try {
        const supabaseClient = await createClient();
        const {
            data: { user },
        } = await supabaseClient.auth.getUser();

        if (!user) throw new Error("User is not logged in.")

        const
            { data, error } = await supabaseClient
                .from("categories")
                .insert([
                    {
                        user_id: user.id,
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        icon: selectedIcon,
                        color: colorHex,
                        type: type,
                    }
                ])

        if (error) throw new Error(`Error inserting category: ${error.message}`)

    } catch (error) {
        throw new Error(`Error creating category: ${error}`)
    }
}