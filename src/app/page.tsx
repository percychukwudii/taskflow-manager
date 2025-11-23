"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Moon, Sun } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";  
import { toast } from "sonner";                    

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedTheme === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Dark mode toggle
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

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTask("");
    setOpen(false);
    toast.success("Task added");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    toast.error("Task deleted", { description: task?.text });
  };

  const activeTasks = tasks.filter(t => !t.completed).length;

  return (
    <>
      <Toaster position="bottom-center" richColors /> {/* ← Add this line */}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-2xl mx-auto p-6 pt-12">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
            <Button variant="outline" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          {/* Add Task Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mb-8" size="lg">
                <Plus className="mr-2 h-5 w-5" /> Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="task">Task description</Label>
                  <Input
                    id="task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder="e.g. Finish the Next.js project"
                    autoFocus
                  />
                </div>
                <Button onClick={addTask} className="w-full">Add Task</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Stats */}
          <div className="text-center mb-8 text-gray-600 dark:text-gray-400">
            {tasks.length === 0 ? (
              <p>No tasks yet. Add one to get started!</p>
            ) : (
              <p>{activeTasks} active {activeTasks === 1 ? "task" : "tasks"} • {tasks.length - activeTasks} completed</p>
            )}
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}