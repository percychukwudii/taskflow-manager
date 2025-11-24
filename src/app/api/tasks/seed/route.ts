import { db } from "@/lib/db/db";
import { tasks as tasksTable } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("Starting database seed...");

        // Clear existing tasks
        await db.delete(tasksTable);

        // Insert sample data
        await db.insert(tasksTable).values([
            { text: "Deploy TaskFlow to Vercel", completed: true },
            { text: "Add dark mode toggle", completed: true },
            { text: "Connect to Postgres", completed: true },
            { text: "Celebrate with coffee", completed: false },
            { text: "Build 10 more apps", completed: false },
        ]);

        console.log("Database seeded successfully!");
        return NextResponse.json({
            success: true,
            message: "Database seeded with 5 sample tasks!"
        });
    } catch (error: any) {
        console.error("Seeding failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}