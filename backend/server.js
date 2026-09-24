// =====================================================
// IMPORT PACKAGES
// =====================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================

dotenv.config();

// =====================================================
// DATABASE CONNECTION
// =====================================================

const connectDB = require("./config/db");

// Connect MongoDB
connectDB();

// =====================================================
// CREATE EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

// Allow frontend requests
app.use(cors());

// Allow JSON request body
app.use(express.json());

// =====================================================
// ROUTES
// =====================================================

// Task routes
const taskRoutes = require("./routes/taskRoutes");

// Auth routes
const authRoutes = require("./routes/authRoutes");

// Task API
app.use("/api/tasks", taskRoutes);

// Auth API
app.use("/api/auth", authRoutes);

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API is running",
  });
});

// =====================================================
// CENTRALIZED ERROR HANDLER
// =====================================================

// This must be AFTER all routes.
// Errors passed using next(error) will come here.

const errorMiddleware = require("./middleware/errorMiddleware");

app.use(errorMiddleware);

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});