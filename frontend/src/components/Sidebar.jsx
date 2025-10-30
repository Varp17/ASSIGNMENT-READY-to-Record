
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Item = ({ to, label, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-3 py-2 rounded-md ${active ? "bg-gray-100 dark:bg-gray-800 font-semibold" : "hover:bg-gray-50 dark:hover:bg-gray-800"} transition-colors`} aria-current={active ? "page" : undefined}>
    <span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0" />
    <span className="truncate">{label}</span>
  </Link>
);

export default function Sidebar({ open = true }) {
  const loc = useLocation();
  return (
    <aside className={`w-64 md:block border-r dark:border-gray-800 bg-white dark:bg-gray-900 ${open ? "translate-x-0" : "-translate-x-full"} transform transition-transform duration-200`}>
      <div className="h-full flex flex-col p-4 gap-4">
        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">TaskBoard</div>
        <nav className="flex-1 flex flex-col gap-1">
          <Item to="/dashboard" label="Dashboard" active={loc.pathname === "/dashboard"} />
          <Item to="/profile" label="Profile" active={loc.pathname === "/profile"} />
        </nav>
        <div className="text-xs text-gray-400">© {new Date().getFullYear()} TaskBoard</div>
      </div>
    </aside>
  );
}
