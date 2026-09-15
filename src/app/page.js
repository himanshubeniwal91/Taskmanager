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

  const handleCreateTask = (newTask) => {

    /*
      ====================================================
      TEMPORARY
      ====================================================

      We have not connected POST /api/tasks to Redux yet.

      Previously we had:

      dispatch(addTask(newTask));

      But addTask was part of our old local Redux setup.

      Now we will connect this to:

      POST /api/tasks

      in the next step.

    */

    console.log(
      "Create task - backend integration coming next:",
      newTask
    );


    setShowTaskForm(false);


    // Refresh tasks after backend CRUD
    // is connected.
  };


  // =====================================================
  // UPDATE TASK
  // =====================================================

  const handleUpdateTask = (updatedTask) => {

    /*
      ====================================================
      TEMPORARY
      ====================================================

      We will connect this to:

      PUT /api/tasks/:id

      in the next step.
    */

    console.log(
      "Update task - backend integration coming next:",
      updatedTask
    );


    setEditingTask(null);

  };


  // =====================================================
  // DELETE TASK
  // =====================================================

  const handleDeleteTask = (taskId) => {

    const confirmed = window.confirm(

      "Are you sure you want to delete this task?"

    );


    if (!confirmed) {

      return;

    }


    /*
      ====================================================
      TEMPORARY
      ====================================================

      We will connect this to:

      DELETE /api/tasks/:id

      in the next step.
    */

    console.log(
      "Delete task - backend integration coming next:",
      taskId
    );

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

              value={totalTasks}

              description="All tasks"

            />


            <StatCard

              title="Pending Tasks"

              value={pendingTasks}

              description="Tasks waiting to start"

            />


            <StatCard

              title="Completed Tasks"

              value={completedTasks}

              description="Successfully completed"

            />


            <StatCard

              title="Overdue Tasks"

              value={overdueTasks}

              description="Need your attention"

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