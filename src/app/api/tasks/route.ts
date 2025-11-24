import { db } from "@/lib/db/db";
import { tasks as tasksTable } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await db.select().from(tasksTable).orderBy(desc(tasksTable.id));
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Failed to fetch tasks:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text || !text.trim()) {
            return NextResponse.json({ error: "Task text is required" }, { status: 400 });
        }

        await db.insert(tasksTable).values({ text: text.trim() });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to create task:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}