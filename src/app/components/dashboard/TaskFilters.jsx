"use client";

import { useState } from "react";

export default function TaskFilters({ onFilterChange, onCreateClick,}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState("none");

  const handleSearch = (value) => {
    setSearch(value);

    onFilterChange({
      search: value,
      status,
      priority,
      sort,
    });
  };

  const handleStatus = (value) => {
    setStatus(value);

    onFilterChange({
      search,
      status: value,
      priority,
      sort,
    });
  };

  const handlePriority = (value) => {
    setPriority(value);

    onFilterChange({
      search,
      status,
      priority: value,
      sort,
    });
  };

  const handleSort = (value) => {
    setSort(value);

    onFilterChange({
      search,
      status,
      priority,
      sort: value,
    });
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => handlePriority(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="none">Sort by Due Date</option>
          <option value="asc">Due Date: Earliest</option>
          <option value="desc">Due Date: Latest</option>
        </select>

        {/* Create Task */}
<button
  onClick={onCreateClick}
  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
>
  + Create Task
</button>

      </div>
    </div>
  );
}