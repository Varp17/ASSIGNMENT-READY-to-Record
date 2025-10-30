import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";

import useAuth from "../context/useAuth";

export default function ConfirmLogout({ onClose }) {
  const { logout } = useAuth();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleConfirm = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <LogOut className="text-red-600 dark:text-red-400 w-7 h-7" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Log out of your account?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            You can always log back in later. Your session will be securely closed.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium"
            >
              Yes, Log Out
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
