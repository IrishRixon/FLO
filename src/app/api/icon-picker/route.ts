import { postCategory } from "@/modules/icon-picker/icon-picker.dal";
import { IconPickerBody } from "@/types/icon-picker.type";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body: IconPickerBody = await req.json();

        await postCategory(body.name, body.icon, body.color, body.type);

        return NextResponse.json({ message: "Category added successfully" })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: `Error adding category: ${error}` },
            { status: 500 }
        )
    }

}