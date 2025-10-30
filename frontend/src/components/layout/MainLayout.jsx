import React from "react";
import Navbar from "../Navbar";

export default function MainLayout({ children, darkMode, setDarkMode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
