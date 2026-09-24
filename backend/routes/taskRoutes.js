
const express= require("express")

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
   getTaskStats,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", authMiddleware, getTaskStats);

// GET ALL TASKS
// GET /api/tasks?page=1&limit=5

router.get("/", authMiddleware, getTasks);


// GET SINGLE TASK
// GET /api/tasks/:id

router.get("/:id", authMiddleware, getTaskById);


// CREATE TASK
// POST /api/tasks

router.post("/", authMiddleware, createTask);


// UPDATE TASK
// PUT /api/tasks/:id

router.put("/:id", authMiddleware, updateTask);


// DELETE TASK
// DELETE /api/tasks/:id

router.delete("/:id", authMiddleware, deleteTask);


module.exports = router;