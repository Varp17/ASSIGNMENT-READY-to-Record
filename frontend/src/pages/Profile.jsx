import React from "react";
import { AuthProvider } from "../components/AuthContext";

export default function Profile() {
  const { user, loading } = AuthProvider();

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-400">
        Loading your profile...
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-400">
        You’re not signed in.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {user.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {user.email}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center sm:text-left">
          <h4 className="text-sm text-gray-500 dark:text-gray-400">Role</h4>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
            {user.role || "User"}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center sm:text-left">
          <h4 className="text-sm text-gray-500 dark:text-gray-400">
            Tasks Created
          </h4>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
            {user.tasksCount || 0}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center sm:text-left text-sm text-gray-500 dark:text-gray-400">
        Profile editing coming soon 🚧
      </div>
    </div>
  );
}
