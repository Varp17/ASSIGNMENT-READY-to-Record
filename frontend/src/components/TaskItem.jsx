import React, { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!value.trim()) return;
    setBusy(true);
    try {
      await onUpdate(task._id, { title: value });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task)}
          className="w-4 h-4 mt-1 accent-indigo-500"
        />
        <div className="min-w-0">
          {editing ? (
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 rounded border dark:bg-gray-900 dark:border-gray-700"
              onKeyDown={(e) => e.key === "Enter" && save()}
              autoFocus
            />
          ) : (
            <div
              className={`text-sm ${
                task.completed
                  ? "line-through text-gray-400"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {task.title}
            </div>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(task.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <button
              onClick={save}
              disabled={busy}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
            >
              {busy ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setValue(task.title);
              }}
              className="px-3 py-1 border rounded text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="text-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-sm text-red-500 hover:text-red-600 px-2 py-1"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
