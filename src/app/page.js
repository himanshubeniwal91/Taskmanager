"use client";

import { useEffect, useState } from "react";

import StatCard from "./components/dashboard/StatCard";
import TaskTable from "./components/dashboard/TaskTable";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

import TaskForm from "./components/dashboard/TaskForm";
import TaskDetails from "./components/dashboard/TaskDetails";
import TaskEditForm from "./components/dashboard/TaskEditForm";

import { useSelector, useDispatch } from "react-redux";

import {
  fetchTasks,
  fetchTaskStats, // SOLUTION
  createTask,
  updateTask,
  deleteTask,
  setPage,
  setLimit,
} from "./components/store/taskSlice";


export default function Home() {

  // =====================================================
  // REDUX
  // =====================================================

  const dispatch = useDispatch();


  // Get tasks from Redux
  const allTasks = useSelector(
    (state) => state.tasks.tasks
  );
// SOLUTION: Get dashboard statistics from Redux
const stats = useSelector((state) => state.tasks.stats);

  // Get pagination from Redux
  const pagination = useSelector(
    (state) => state.tasks.pagination
  );


  // Get loading state
  const loading = useSelector(
    (state) => state.tasks.loading
  );


  // Get error state
  const error = useSelector(
    (state) => state.tasks.error
  );


  // =====================================================
  // FILTER STATE
  // =====================================================

  const [filters, setFilters] = useState({

    search: "",

    status: "All",

    priority: "All",

    sort: "",

  });


  // =====================================================
  // UI STATE
  // =====================================================

  const [showTaskForm, setShowTaskForm] =
    useState(false);


  const [selectedTask, setSelectedTask] =
    useState(null);


  const [editingTask, setEditingTask] =
    useState(null);


  // =====================================================
  // FETCH TASKS
  // =====================================================

  useEffect(() => {

    dispatch(

      fetchTasks({

        page: pagination.page,

        limit: pagination.limit,

        search: filters.search,

        status: filters.status,

        priority: filters.priority,

        sort: filters.sort,

      })

    );

  }, [

    dispatch,

    pagination.page,

    pagination.limit,

    filters.search,

    filters.status,

    filters.priority,

    filters.sort,

  ]);

// SOLUTION: Fetch dashboard statistics when page loads
useEffect(() => {
  dispatch(fetchTaskStats());
}, [dispatch]);
  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  // SOLUTION:
  // Total tasks comes from backend pagination.
  //
  // Example:
  // MongoDB has 20 tasks
  // Current page has only 5
  //
  // allTasks.length = 5
  // pagination.totalTasks = 20
  //
  // Therefore use pagination.totalTasks.

  const totalTasks =
    pagination.totalTasks;


  // IMPORTANT:
  // These three currently count only the tasks
  // returned on the current page.
  //
  // Later we will create a separate backend
  // statistics API to calculate the real totals.

  const pendingTasks =
    allTasks.filter(
      (task) => task.status === "Pending"
    ).length;


  const completedTasks =
    allTasks.filter(
      (task) => task.status === "Completed"
    ).length;


  const overdueTasks =
    allTasks.filter(

      (task) =>

        new Date(task.dueDate) < new Date() &&

        task.status !== "Completed"

    ).length;


  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = ({

    search,

    status,

    priority,

    sort,

  }) => {

    // Save filters locally

    setFilters({

      search,

      status,

      priority,

      sort,

    });


    // SOLUTION:
    // Whenever filter changes,
    // start from page 1.

    dispatch(setPage(1));

  };


  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (page) => {

    // Change page in Redux.
    //
    // This will trigger useEffect()
    // and fetch data from backend.

    dispatch(setPage(page));

  };


  // =====================================================
  // LIMIT CHANGE
  // =====================================================

  const handleLimitChange = (limit) => {

    // Convert select value from string to number.

    dispatch(setLimit(Number(limit)));

  };


  // =====================================================
  // VIEW TASK
  // =====================================================

  const handleViewTask = (task) => {

    setSelectedTask(task);

  };


  // =====================================================
  // EDIT TASK
  // =====================================================

  const handleEditTask = (task) => {

    setEditingTask(task);

  };


  // =====================================================
  // CREATE TASK
  // =====================================================

 const handleCreateTask = async (newTask) => {

  try {

    // Send task to backend
    await dispatch(
      createTask(newTask)
    ).unwrap();


    // Close modal
    setShowTaskForm(false);


    // Refresh current page from MongoDB
    dispatch(

      fetchTasks({

        page: pagination.page,

        limit: pagination.limit,

        search: filters.search,

        status: filters.status,

        priority: filters.priority,

        sort: filters.sort,

      })

    );


  } catch (error) {

    console.error(
      "Create task failed:",
      error
    );

  }

};

  // =====================================================
  // UPDATE TASK
  // =====================================================

  const handleUpdateTask = async (updatedTask) => {

  try {

    // =================================================
    // IMPORTANT
    // =================================================
    // MongoDB gives us _id.
    //
    // In our Redux fetchTasks() we also created:
    //
    // id: task._id
    //
    // So task.id can be used for the API URL.

    await dispatch(

      updateTask({

        id: updatedTask.id,

        taskData: {

          title: updatedTask.title,

          description: updatedTask.description,

          priority: updatedTask.priority,

          status: updatedTask.status,

          dueDate: updatedTask.dueDate,

        },

      })

    ).unwrap();


    // Close edit modal

    setEditingTask(null);


    // =================================================
    // REFRESH DATA FROM MONGODB
    // =================================================

    dispatch(

      fetchTasks({

        page: pagination.page,

        limit: pagination.limit,

        search: filters.search,

        status: filters.status,

        priority: filters.priority,

        sort: filters.sort,

      })

    );


  } catch (error) {

    console.error(
      "Update task failed:",
      error
    );

  }

};


const handleDeleteTask = async (taskId) => {

  // =================================================
  // CONFIRM DELETE
  // =================================================

  const confirmed = window.confirm(

    "Are you sure you want to delete this task?"

  );


  if (!confirmed) {

    return;

  }


  try {

    // =================================================
    // DELETE FROM MONGODB
    // =================================================

    await dispatch(

      deleteTask(taskId)

    ).unwrap();


    // =================================================
    // REFRESH CURRENT PAGE
    // =================================================

    dispatch(

      fetchTasks({

        page: pagination.page,

        limit: pagination.limit,

        search: filters.search,

        status: filters.status,

        priority: filters.priority,

        sort: filters.sort,

      })

    );


  } catch (error) {

    console.error(

      "Delete task failed:",

      error

    );

  }

};


  // =====================================================
  // DEBUG
  // =====================================================

  console.log(
    "TASKS FROM REDUX:",
    allTasks
  );


  console.log(
    "PAGINATION:",
    pagination
  );


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="flex min-h-screen bg-gray-100">


      {/* =================================================
          SIDEBAR
          ================================================= */}

      <Sidebar />


      <div className="flex min-w-0 flex-1 flex-col">


        {/* =================================================
            NAVBAR
            ================================================= */}

        <Navbar />


        <main className="flex-1 p-6">


          {/* =================================================
              HEADING
              ================================================= */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-900">

              Dashboard

            </h1>


            <p className="mt-1 text-gray-500">

              Manage your tasks efficiently

            </p>

          </div>


          {/* =================================================
              ERROR
              ================================================= */}

          {error && (

            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">

              Failed to load tasks: {error}

            </div>

          )}


          {/* =================================================
              STATISTICS
              ================================================= */}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">


            <StatCard
  title="Total Tasks"
  value={stats.totalTasks}
    description="All tasks in the system"
/>

<StatCard
  title="Pending Tasks"
  value={stats.pendingTasks}
    description="Tasks waiting to be completed"
/>

<StatCard
  title="Completed Tasks"
  value={stats.completedTasks}
   description="Successfully completed tasks"
/>

<StatCard
  title="Overdue Tasks"
  value={stats.overdueTasks}
    description="Tasks past their due date"
/>

          </div>


          {/* =================================================
              TASK TABLE
              ================================================= */}

          <div className="mt-8">


            {loading ? (

              <div className="rounded-lg bg-white p-8 text-center">

                <p className="text-gray-500">

                  Loading tasks...

                </p>

              </div>

            ) : (

              <TaskTable

                // SOLUTION:
                // Backend already handles:
                // search
                // filter
                // sort
                // pagination

                tasks={allTasks}


                // Filter callback

                onFilterChange={
                  handleFilterChange
                }


                // Create

                onCreateClick={() =>
                  setShowTaskForm(true)
                }


                // View

                onViewTask={
                  handleViewTask
                }


                // Edit

                onEditTask={
                  handleEditTask
                }


                // Delete

                onDeleteTask={
                  handleDeleteTask
                }


                // =================================================
                // PAGINATION
                // =================================================

                pagination={
                  pagination
                }


                onPageChange={
                  handlePageChange
                }


                onLimitChange={
                  handleLimitChange
                }

              />

            )}


          </div>


        </main>

      </div>


      {/* =================================================
          CREATE TASK MODAL
          ================================================= */}

      {showTaskForm && (

        <TaskForm

          onClose={() =>
            setShowTaskForm(false)
          }


          onCreateTask={
            handleCreateTask
          }

        />

      )}


      {/* =================================================
          VIEW TASK MODAL
          ================================================= */}

      {selectedTask && (

        <TaskDetails

          task={selectedTask}

          onClose={() =>
            setSelectedTask(null)
          }

        />

      )}


      {/* =================================================
          EDIT TASK MODAL
          ================================================= */}

      {editingTask && (

        <TaskEditForm

          task={editingTask}

          onClose={() =>
            setEditingTask(null)
          }


          onUpdateTask={
            handleUpdateTask
          }

        />

      )}


    </div>

  );

}