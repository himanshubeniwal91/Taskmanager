"use client";

import { useState } from "react";

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">

      {/* Mobile / Page title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Task Management
        </h2>

        <p className="hidden text-xs text-gray-500 sm:block">
          Stay organized and productive
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          🔔

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              H
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-gray-900">
                Himanshu
              </p>

              <p className="text-xs text-gray-500">
                User
              </p>
            </div>
          </button>

          {/* Profile dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
              <button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50">
                Profile
              </button>

              <button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50">
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}