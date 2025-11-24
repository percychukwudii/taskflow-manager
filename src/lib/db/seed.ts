import { db } from "./db";
import { tasks } from "./schema";

const sampleTasks = [
    { text: "Deploy TaskFlow to Vercel", completed: true },
    { text: "Add dark mode toggle", completed: true },
    { text: "Connect to Postgres", completed: true },
    { text: "Celebrate with coffee", completed: false },
    { text: "Build 10 more apps", completed: false },
];

async function seed() {
    await db.delete(tasks); 
    await db.insert(tasks).values(sampleTasks);
    console.log("Seeded database with sample tasks!");
}

seed().catch(console.error);