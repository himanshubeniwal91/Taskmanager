const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// Import MongoDB connection function
const connectDB = require("./config/db");



dotenv.config();
// Connect to MongoDB
connectDB();

const app = express();


// Middleware

app.use(cors());

app.use(express.json());


const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);

// Test API

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Task Management API is running",
  });

});


// Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});