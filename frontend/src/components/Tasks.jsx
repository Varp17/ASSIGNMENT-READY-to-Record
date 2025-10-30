import React, { useEffect, useState } from "react";
import api from "../services/api";
import TaskItem from "../components/TaskItem";
import Toast from "../components/Toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch {
      showToast("error", "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post("/tasks", { title, description: desc });
    setTitle("");
    setDesc("");
    showToast("success", "Task added!");
    fetchTasks();
  }

  async function deleteTask(id) {
    await api.delete(`/tasks/${id}`);
    showToast("success", "Task deleted!");
    fetchTasks();
  }

  async function updateTask(id, payload) {
    await api.put(`/tasks/${id}`, payload);
    showToast("success", "Task updated!");
    fetchTasks();
  }

  async function toggleTask(task) {
    await updateTask(task._id, { completed: !task.completed });
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded shadow-sm border dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Tasks</h2>

      <form onSubmit={addTask} className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border px-3 py-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          className="border px-3 py-2 rounded flex-1 dark:bg-gray-800 dark:border-gray-700"
        />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Add
        </button>
      </form>

      {loading ? (
        <div>Loading…</div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          No tasks yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((t) => (
            <TaskItem
              key={t._id}
              task={t}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onToggle={toggleTask}
            />
          ))}
        </ul>
      )}

      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
