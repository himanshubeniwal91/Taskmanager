import TaskFilters from "./TaskFilters";

export default function TaskTable({
  tasks,
  onFilterChange,
   onCreateClick,
   onViewTask,
   onEditTask,
   onDeleteTask,
     // SOLUTION
  pagination,
  onPageChange,
  onLimitChange,

}) {
  return (
    <div>

      {/* Filters */}
    <TaskFilters onFilterChange={onFilterChange} onCreateClick={onCreateClick}/>
      {/* Task Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Tasks
          </h2>

          <p className="text-sm text-gray-500">
            Manage your current tasks
          </p>
        </div>

        <div className="overflow-x-auto">


          <div className="flex items-center gap-3">

  <span className="text-sm text-gray-600">
    Show:
  </span>

  <select
    value={pagination.limit}
    onChange={(e) =>
      onLimitChange(e.target.value)
    }
    className="rounded border px-3 py-2"
  >

    <option value="5">5</option>

    <option value="10">10</option>

    <option value="20">20</option>

  </select>

  <span className="text-sm text-gray-600">
    tasks per page
  </span>

</div>
          <table className="w-full text-left">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                  Task
                </th>

                <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                  Priority
                </th>

                <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                  Status
                </th>

               <th className="px-6 py-3 text-sm font-semibold text-gray-600">
  Due Date
</th>

<th className="px-6 py-3 text-sm font-semibold text-gray-600">
  Actions
</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="transition hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {task.title}
                      </p>

                      <p className="text-sm text-gray-500">
                        {task.description}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {task.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.dueDate}
                    </td>

<td className="px-6 py-4">
  <div className="flex items-center gap-2">

    <button
      onClick={() => onViewTask(task)}
      className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
    >
      View
    </button>

    <button
      onClick={() => onEditTask(task)}
      className="rounded-md px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50"
    >
      Edit
    </button>

    <button
      onClick={() => onDeleteTask(task.id)}
      className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Delete
    </button>

  </div>
</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No tasks found
                  </td>
                </tr>
              )}

            </tbody>

          </table>



          {/* PAGINATION */}

<div className="flex items-center justify-between border-t px-4 py-4">

  {/* Previous */}

  <button
    onClick={() => onPageChange(pagination.page - 1)}
    disabled={pagination.page === 1}
    className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    Previous
  </button>


  {/* Page information */}

  <span className="text-sm text-gray-600">
    Page {pagination.page} of {pagination.totalPages}
  </span>


  {/* Next */}

  <button
    onClick={() => onPageChange(pagination.page + 1)}
    disabled={
      pagination.page === pagination.totalPages
    }
    className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    Next
  </button>

</div>
        </div>
      </div>

    </div>
  );
}