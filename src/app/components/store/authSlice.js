import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

// =====================================================
// LOGIN
// =====================================================

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      // Save JWT in browser
      localStorage.setItem("token", token);

      // Save user in browser
      localStorage.setItem("user", JSON.stringify(user));

      return {
        token,
        user,
      };

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// =====================================================
// AUTH SLICE
// =====================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    // =================================================
    // RESTORE LOGIN AFTER PAGE REFRESH
    // =================================================

    initializeAuth: (state) => {

      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Get user from localStorage
      const user = localStorage.getItem("user");

      // If token and user exist
      if (token && user) {

        state.token = token;

        state.user = JSON.parse(user);

        state.isAuthenticated = true;

      } else {

        state.token = null;

        state.user = null;

        state.isAuthenticated = false;
      }
    },

    // =================================================
    // LOGOUT
    // =================================================

    logout: (state) => {

      // Remove token
      localStorage.removeItem("token");

      // Remove user
      localStorage.removeItem("user");

      // Clear Redux state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },

  // ===================================================
  // ASYNC ACTIONS
  // ===================================================

  extraReducers: (builder) => {

    builder

      // LOGIN START
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {

        state.loading = false;

        state.user = action.payload.user;

        state.token = action.payload.token;

        state.isAuthenticated = true;

        state.error = null;
      })

      // LOGIN FAILED
      .addCase(loginUser.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

        state.isAuthenticated = false;
      });
  },
});

// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  initializeAuth,
  logout,
} = authSlice.actions;

export default authSlice.reducer;