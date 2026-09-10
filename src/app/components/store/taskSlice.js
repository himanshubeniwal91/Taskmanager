
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [
    {
      id: 1,
      title: "Complete Login Page",
      description: "Implement login UI and form validation",
      priority: "High",
      status: "Pending",
      dueDate: "2026-09-02",
    },
    {
      id: 2,
      title: "Create Task API",
      description: "Develop REST API for task management",
      priority: "High",
      status: "In Progress",
      dueDate: "2026-09-04",
    },
    {
      id: 3,
      title: "Build Dashboard",
      description: "Create task management dashboard",
      priority: "Medium",
      status: "Completed",
      dueDate: "2026-08-29",
    },
    {
      id: 4,
      title: "Add Search Functionality",
      description: "Implement search by task title",
      priority: "Medium",
      status: "Pending",
      dueDate: "2026-09-06",
    },
    {
      id: 5,
      title: "Database Design",
      description: "Design MongoDB collections",
      priority: "Low",
      status: "Completed",
      dueDate: "2026-08-27",
    },
    {
      id: 6,
      title: "Implement Authentication",
      description: "Add JWT based authentication",
      priority: "High",
      status: "Pending",
      dueDate: "2026-09-08",
    },
    {
      id: 7,
      title: "Create Task Details",
      description: "Build task details page",
      priority: "Low",
      status: "In Progress",
      dueDate: "2026-09-10",
    },
  ],
  // SOLUTION:
  // Pagination information
  pagination: {
    page: 1,
    limit: 5,
    totalTasks: 7,
    totalPages: 2,
  },

};




const taskSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {

    addTask: (state, action) => {
      state.tasks.unshift(action.payload);


       // SOLUTION:
      // Later this information will come from backend
      state.pagination.totalTasks += 1;
    },

    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );

      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },

    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );

        // SOLUTION:
      state.pagination.totalTasks -= 1;
    },

    // SOLUTION:
    // Change current page
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },

  // SOLUTION:
    // Change number of tasks displayed per page
    setLimit: (state, action) => {

      state.pagination.limit = action.payload;

      // When limit changes,
      // start again from page 1
      state.pagination.page = 1;

    },


  },
});

export const {
  addTask,
  updateTask,
  deleteTask,

    // SOLUTION:
  setPage,
  setLimit,
} = taskSlice.actions;

export default taskSlice.reducer;