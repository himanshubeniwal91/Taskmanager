import { configureStore } from "@reduxjs/toolkit";

import taskReducer from "./taskSlice";

// SOLUTION:
// Import authentication reducer
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {

    // Task state
    tasks: taskReducer,

    // Authentication state
    auth: authReducer,
  },
});