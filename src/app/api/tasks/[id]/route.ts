import { db } from "@/lib/db/db";
import { tasks as tasksTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// In Next.js App Router, params is a Promise that needs to be awaited
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await the params promise
        const { id } = await params;
        const { completed } = await request.json();

        console.log(`Updating task ${id} with completed: ${completed}`);

        // Parse id to integer and validate
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            return NextResponse.json({
                error: "Invalid task ID"
            }, { status: 400 });
        }

        await db.update(tasksTable)
            .set({ completed })
            .where(eq(tasksTable.id, taskId));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to update task:", error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await the params promise
        const { id } = await params;

        console.log(`Deleting task ${id}`);

        // Parse id to integer and validate
        const taskId = parseInt(id);
        if (isNaN(taskId)) {
            return NextResponse.json({
                error: "Invalid task ID"
            }, { status: 400 });
        }

        await db.delete(tasksTable)
            .where(eq(tasksTable.id, taskId));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete task:", error);
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}