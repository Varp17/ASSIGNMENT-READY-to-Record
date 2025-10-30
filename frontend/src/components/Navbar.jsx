import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function Navbar({ darkMode, setDarkMode, onLogoutClick }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center px-4 py-3 max-w-6xl mx-auto">
        {/* Brand */}
        <div
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold cursor-pointer text-indigo-600 dark:text-indigo-400"
        >
          TaskBoard
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 border dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="font-medium text-sm">
                {user?.name || "User"}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={menuOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-md shadow-lg overflow-hidden"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogoutClick();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
