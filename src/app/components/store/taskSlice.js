import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

// =====================================================
// GET DASHBOARD STATISTICS
// =====================================================

// SOLUTION:
// Fetch statistics directly from MongoDB through backend.
// This gives accurate counts for ALL tasks,
// not just the tasks on the current pagination page.
export const fetchTaskStats = createAsyncThunk(
  "tasks/fetchTaskStats",

  async () => {
    const response = await api.get("/tasks/stats");

    return response.data;
  }
);

// =====================================================
// GET TASKS FROM BACKEND
// =====================================================

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",

  async ({
    page = 1,
    limit = 5,
    search = "",
    status = "All",
    priority = "All",
    sort = "",
  }) => {

    const response = await api.get("/tasks", {
      params: {
        page,
        limit,
        search,
        status,
        priority,
        sort,
      },
    });

    return response.data;
  }
);

// =====================================================
// CREATE TASK
// =====================================================

export const createTask = createAsyncThunk(
  "tasks/createTask",

  async (taskData) => {

    const response = await api.post(
      "/tasks",
      taskData
    );

    return response.data;
  }
);

// =====================================================
// UPDATE TASK
// =====================================================

export const updateTask = createAsyncThunk(
  "tasks/updateTask",

  async ({ id, taskData }) => {

    const response = await api.put(
      `/tasks/${id}`,
      taskData
    );

    return response.data;
  }
);

// =====================================================
// DELETE TASK
// =====================================================

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",

  async (id) => {

    const response = await api.delete(
      `/tasks/${id}`
    );

    return response.data;
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {

  // ===================================================
  // TASK DATA
  // ===================================================

  tasks: [],


  // ===================================================
  // DASHBOARD STATISTICS
  // ===================================================

  // SOLUTION:
  // These values come from:
  // GET /api/tasks/stats
  //
  // They represent ALL tasks in MongoDB.
  stats: {
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  },


  // ===================================================
  // PAGINATION
  // ===================================================

  pagination: {
    page: 1,
    limit: 5,
    totalTasks: 0,
    totalPages: 0,
  },


  // ===================================================
  // FILTERS
  // ===================================================

  filters: {
    search: "",
    status: "All",
    priority: "All",
    sort: "",
  },


  // ===================================================
  // LOADING / ERROR
  // ===================================================

  loading: false,

  error: null,
};


// =====================================================
// SLICE
// =====================================================

const taskSlice = createSlice({

  name: "tasks",

  initialState,

  reducers: {

    // =================================================
    // CHANGE PAGE
    // =================================================

    setPage: (state, action) => {

      state.pagination.page = action.payload;

    },


    // =================================================
    // CHANGE ITEMS PER PAGE
    // =================================================

    setLimit: (state, action) => {

      state.pagination.limit = action.payload;

      // When items per page changes,
      // start again from page 1.
      state.pagination.page = 1;

    },

  },


  // ===================================================
  // ASYNC API RESPONSE
  // ===================================================

  extraReducers: (builder) => {

    builder


      // =================================================
      // FETCH TASKS
      // =================================================

      // REQUEST STARTED
      .addCase(fetchTasks.pending, (state) => {

        state.loading = true;

        state.error = null;

      })


      // REQUEST SUCCESS
      .addCase(fetchTasks.fulfilled, (state, action) => {

        state.loading = false;


        // Backend returns MongoDB _id.
        //
        // Example:
        // {
        //   _id: "68abc...",
        //   title: "Create Login"
        // }
        //
        // Our frontend uses "id".
        // Therefore convert:
        //
        // _id → id

        state.tasks = action.payload.data.map((task) => ({

          ...task,

          id: task._id,

        }));


        // Save pagination information
        // returned from backend.

        state.pagination =
          action.payload.pagination;


        // Save filters returned from backend.

        state.filters =
          action.payload.filters;

      })


      // REQUEST FAILED
      .addCase(fetchTasks.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.error.message;

      })


      // =================================================
      // FETCH TASK STATISTICS
      // =================================================

      // REQUEST STARTED
      .addCase(fetchTaskStats.pending, (state) => {

        // We don't need to use the main loading flag here
        // because statistics loading should not make
        // the whole task table show loading.

        state.error = null;

      })


      // REQUEST SUCCESS
      .addCase(fetchTaskStats.fulfilled, (state, action) => {

        // SOLUTION:
        // Store statistics returned from MongoDB.

        state.stats =
          action.payload.data;

      })


      // REQUEST FAILED
      .addCase(fetchTaskStats.rejected, (state, action) => {

        state.error =
          action.error.message;

      })


      // =================================================
      // CREATE TASK
      // =================================================

      // REQUEST STARTED
      .addCase(createTask.pending, (state) => {

        state.loading = true;

        state.error = null;

      })


      // REQUEST SUCCESS
      .addCase(createTask.fulfilled, (state, action) => {

        state.loading = false;


        // Backend returns the newly created task.

        const task =
          action.payload.data;


        // Convert _id → id

        state.tasks.unshift({

          ...task,

          id: task._id,

        });

      })


      // REQUEST FAILED
      .addCase(createTask.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.error.message;

      })


      // =================================================
      // UPDATE TASK
      // =================================================

      // REQUEST STARTED
      .addCase(updateTask.pending, (state) => {

        state.loading = true;

        state.error = null;

      })


      // REQUEST SUCCESS
      .addCase(updateTask.fulfilled, (state, action) => {

        state.loading = false;


        const updatedTask =
          action.payload.data;


        // Find the task that was updated.

        const index =
          state.tasks.findIndex(
            (task) =>
              task.id === updatedTask._id
          );


        // If task exists on the current page,
        // replace it with the updated task.

        if (index !== -1) {

          state.tasks[index] = {

            ...updatedTask,

            id: updatedTask._id,

          };

        }

      })


      // REQUEST FAILED
      .addCase(updateTask.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.error.message;

      })


      // =================================================
      // DELETE TASK
      // =================================================

      // REQUEST STARTED
      .addCase(deleteTask.pending, (state) => {

        state.loading = true;

        state.error = null;

      })


      // REQUEST SUCCESS
      .addCase(deleteTask.fulfilled, (state, action) => {

        state.loading = false;


        const deletedTask =
          action.payload.data;


        // Remove deleted task from Redux state.

        state.tasks =
          state.tasks.filter(
            (task) =>
              task.id !== deletedTask._id
          );

      })


      // REQUEST FAILED
      .addCase(deleteTask.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.error.message;

      });

  },

});


// =====================================================
// EXPORT REDUX ACTIONS
// =====================================================

export const {
  setPage,
  setLimit,
} = taskSlice.actions;


// =====================================================
// EXPORT REDUCER
// =====================================================

export default taskSlice.reducer;