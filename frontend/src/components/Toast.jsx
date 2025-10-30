import React, { useEffect } from "react";

export default function Toast({ toasts = [], onClose }) {
  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => onClose(t.id), 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, onClose]);

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded shadow-md max-w-xs font-medium transition-all ${
            t.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
