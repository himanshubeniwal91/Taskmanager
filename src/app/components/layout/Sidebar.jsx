"use client";

import { useState } from "react";

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menuItems = [
    "Dashboard",
    "Tasks",
    "Settings",
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="flex h-full min-h-screen flex-col">

        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <h1 className="text-xl font-bold text-gray-900">
            Task<span className="text-blue-600">Flow</span>
          </h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveMenu(item)}
                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  activeMenu === item
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-200 p-4">
          <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            Logout
          </button>
        </div>

      </div>
    </aside>
  );
}