import React, { useEffect, useMemo, useState } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/api";
import TaskItem from "../components/TaskItem";
import  useAuth  from "../context/useAuth";
import Toast from "../components/Toast";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { id, type, message }]);
    return id;
  };
  const removeToast = (id) => setToasts((s) => s.filter((t) => t.id !== id));

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchTasks();
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
      pushToast("error", "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createNew = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await createTask({ title: newTask.trim() });
      setNewTask("");
      await load();
      pushToast("success", "Task added");
    } catch {
      pushToast("error", "Could not add task");
    }
  };

  const toggle = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      await load();
      pushToast("success", task.completed ? "Marked active" : "Marked complete");
    } catch {
      pushToast("error", "Could not update task");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      await load();
      pushToast("success", "Task deleted");
    } catch {
      pushToast("error", "Could not delete task");
    }
  };

  const edit = async (id, payload) => {
    try {
      await updateTask(id, payload);
      await load();
      pushToast("success", "Task updated");
    } catch {
      pushToast("error", "Could not update task");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter === "active" && t.completed) return false;
      if (filter === "completed" && !t.completed) return false;
      if (!q) return true;
      return t.title.toLowerCase().includes(q);
    });
  }, [tasks, query, filter]);

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50 dark:bg-gray-950 transition-colors">
      <Toast toasts={toasts} onClose={removeToast} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Summary */}
        <aside className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Welcome, {user?.name || "User"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage tasks efficiently — synced & secure.
            </p>

            <form onSubmit={createNew} className="mt-6 flex gap-2">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task..."
                className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total
              </p>
              <p className="text-2xl font-semibold">{tasks.length}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-semibold">
                {tasks.filter((t) => t.completed).length}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 self-end sm:self-center">
              JWT Protected • Realtime Sync
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No tasks found — add one above.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((t) => (
                <TaskItem
                  key={t._id}
                  task={t}
                  onToggle={toggle}
                  onDelete={remove}
                  onUpdate={edit}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
