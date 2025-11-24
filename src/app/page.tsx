"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Moon, Sun } from "lucide-react";
import { Toaster, toast } from "sonner";

// REMOVED database imports - they don't work in client components
interface Task {
  id: number;
  text: string;
  completed: boolean;
  created_at?: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Updated to use API route
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const result = await response.json();
      setTasks(result);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  // Updated to use API route
  const addTask = async () => {
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTask.trim() }),
      });

      if (!response.ok) throw new Error('Failed to add task');

      setNewTask("");
      setOpen(false);
      toast.success("Task added");
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // Updated to use API route
  const toggleTask = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  // Updated to use API route
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      toast.error("Task deleted");
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <>
      <Toaster position="bottom-center" richColors />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-2xl mx-auto p-6 pt-12">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            <Button variant="outline" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mb-8" size="lg">
                <Plus className="mr-2 h-5 w-5" /> Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a new task</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <Label htmlFor="task">Task description</Label>
                <Input
                  id="task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="e.g. Deploy to Vercel"
                  autoFocus
                />
                <Button onClick={addTask} className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add Task"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No tasks yet. Add one!</p>
            ) : (
              tasks.map((task) => (
                <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id, task.completed)}
                    />
                    <span className={`flex-1 text-lg ${task.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-white"}`}>
                      {task.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}