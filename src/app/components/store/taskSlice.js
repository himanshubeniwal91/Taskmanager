import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";


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
// INITIAL STATE
// =====================================================

const initialState = {

  tasks: [],

  pagination: {
    page: 1,
    limit: 5,
    totalTasks: 0,
    totalPages: 0,
  },

  filters: {
    search: "",
    status: "All",
    priority: "All",
    sort: "",
  },

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

    // We'll use these later for CRUD

    setPage: (state, action) => {

      state.pagination.page = action.payload;

    },


    setLimit: (state, action) => {

      state.pagination.limit = action.payload;

      // When limit changes,
      // start again from page 1
      state.pagination.page = 1;

    },

  },


  // ===================================================
  // ASYNC API RESPONSE
  // ===================================================

  extraReducers: (builder) => {

    builder

      // REQUEST STARTED
      .addCase(fetchTasks.pending, (state) => {

        state.loading = true;

        state.error = null;

      })


      // REQUEST SUCCESS
      .addCase(fetchTasks.fulfilled, (state, action) => {

        state.loading = false;


        // Backend returns MongoDB _id.
        // Our existing UI uses id.
        // So convert _id → id.

        state.tasks = action.payload.data.map((task) => ({

          ...task,

          id: task._id,

        }));


        state.pagination =
          action.payload.pagination;


        state.filters =
          action.payload.filters;

      })


      // REQUEST FAILED
      .addCase(fetchTasks.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.error.message;

      });

  },

});


export const {
  setPage,
  setLimit,
} = taskSlice.actions;


export default taskSlice.reducer;