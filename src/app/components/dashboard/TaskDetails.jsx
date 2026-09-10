"use client";

export default function TaskDetails({ task, onClose }) {
  if (!task) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Task Details
            </h2>

            <p className="text-sm text-gray-500">
              View task information
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Details */}
        <div className="space-y-5 p-6">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Title
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {task.title}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Description
            </p>

            <p className="mt-1 text-sm text-gray-600">
              {task.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Priority
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.priority}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Status
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.status}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Due Date
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.dueDate}
              </p>
            </div>

          </div>

          {/* Close */}
          <div className="flex justify-end border-t border-gray-200 pt-5">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}