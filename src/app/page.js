"use client";

import StatCard from "./components/dashboard/StatCard";
import TaskTable from "./components/dashboard/TaskTable";

import { useState, useMemo } from "react";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import TaskForm from "./components/dashboard/TaskForm";

import { useSelector, useDispatch } from "react-redux";

import {
  addTask,
  updateTask,
  deleteTask,

  // SOLUTION:
  setPage,
  setLimit,

} from "./components/store/taskSlice";

import TaskDetails from "./components/dashboard/TaskDetails";
import TaskEditForm from "./components/dashboard/TaskEditForm";


export default function Home() {

  const dispatch = useDispatch();


  // Get all tasks from Redux
  const allTasks = useSelector(
    (state) => state.tasks.tasks
  );


  // SOLUTION:
  // Get pagination information from Redux
  const pagination = useSelector(
    (state) => state.tasks.pagination
  );


  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    priority: "All",
    sort: "",
  });


  const [showTaskForm, setShowTaskForm] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const [editingTask, setEditingTask] = useState(null);


  const totalTasks = allTasks.length;


  const pendingTasks = allTasks.filter(
    (task) => task.status === "Pending"
  ).length;


  const completedTasks = allTasks.filter(
    (task) => task.status === "Completed"
  ).length;


  const overdueTasks = allTasks.filter(
    (task) =>
      new Date(task.dueDate) < new Date() &&
      task.status !== "Completed"
  ).length;


  /*
  ==========================================
  SEARCH + FILTER + SORT
  ==========================================
  */

  const filteredTasks = useMemo(() => {

    let result = [...allTasks];


    if (filters.search) {

      result = result.filter((task) =>
        task.title
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      );

    }


    if (filters.status !== "All") {

      result = result.filter(
        (task) => task.status === filters.status
      );

    }


    if (filters.priority !== "All") {

      result = result.filter(
        (task) => task.priority === filters.priority
      );

    }


    if (filters.sort === "asc") {

      result.sort(
        (a, b) =>
          new Date(a.dueDate) -
          new Date(b.dueDate)
      );

    }


    if (filters.sort === "desc") {

      result.sort(
        (a, b) =>
          new Date(b.dueDate) -
          new Date(a.dueDate)
      );

    }


    return result;

  }, [
    allTasks,
    filters.search,
    filters.status,
    filters.priority,
    filters.sort,
  ]);


  /*
  ==========================================
  FILTER CHANGE
  ==========================================
  */

  const handleFilterChange = ({
    search,
    status,
    priority,
    sort,
  }) => {

    setFilters({
      search,
      status,
      priority,
      sort,
    });


    // SOLUTION:
    // Whenever filter changes,
    // start pagination from page 1.
    dispatch(setPage(1));

  };


  /*
  ==========================================
  CREATE
  ==========================================
  */

  const handleCreateTask = (newTask) => {

    dispatch(addTask(newTask));

    setShowTaskForm(false);

  };


  /*
  ==========================================
  VIEW
  ==========================================
  */

  const handleViewTask = (task) => {
    setSelectedTask(task);
  };


  /*
  ==========================================
  EDIT
  ==========================================
  */

  const handleEditTask = (task) => {
    setEditingTask(task);
  };


  /*
  ==========================================
  UPDATE
  ==========================================
  */

  const handleUpdateTask = (updatedTask) => {

    dispatch(updateTask(updatedTask));

    setEditingTask(null);

  };


  /*
  ==========================================
  DELETE
  ==========================================
  */

  const handleDeleteTask = (taskId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );


    if (!confirmed) {
      return;
    }


    dispatch(deleteTask(taskId));

  };


  /*
  ==========================================
  PAGINATION
  ==========================================
  */

  const handlePageChange = (page) => {

    // SOLUTION:
    // Tell Redux which page user selected
    dispatch(setPage(page));

  };


  /*
  ==========================================
  LIMIT CHANGE
  ==========================================
  */

  const handleLimitChange = (limit) => {

    // SOLUTION:
    // Change number of records per page
    dispatch(setLimit(Number(limit)));

  };
console.log("PAGINATION:", pagination);

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />


      <div className="flex min-w-0 flex-1 flex-col">

        <Navbar />


        <main className="flex-1 p-6">


          {/* Heading */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your tasks efficiently
            </p>

          </div>


          {/* Statistics */}

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


          {/* Tasks */}

          <div className="mt-8">

            <TaskTable
              tasks={filteredTasks}

              onFilterChange={handleFilterChange}

              onCreateClick={() =>
                setShowTaskForm(true)
              }

              onViewTask={handleViewTask}

              onEditTask={handleEditTask}

              onDeleteTask={handleDeleteTask}


              // SOLUTION:
              // Pass pagination information
              pagination={pagination}

              // Pass pagination functions
              onPageChange={handlePageChange}

              onLimitChange={handleLimitChange}

            />

          </div>


        </main>

      </div>


      {/* CREATE TASK */}

      {showTaskForm && (

        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onCreateTask={handleCreateTask}
        />

      )}


      {/* VIEW TASK */}

      {selectedTask && (

        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />

      )}


      {/* EDIT TASK */}

      {editingTask && (

        <TaskEditForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdateTask={handleUpdateTask}
        />

      )}

    </div>

  );

}