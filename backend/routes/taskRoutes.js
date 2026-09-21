
const express= require("express")

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
   getTaskStats,
} = require("../controllers/taskController");


const router = express.Router();

router.get("/stats", getTaskStats);

// GET ALL TASKS
// GET /api/tasks?page=1&limit=5

router.get("/", getTasks);


// GET SINGLE TASK
// GET /api/tasks/:id

router.get("/:id", getTaskById);


// CREATE TASK
// POST /api/tasks

router.post("/", createTask);


// UPDATE TASK
// PUT /api/tasks/:id

router.put("/:id", updateTask);


// DELETE TASK
// DELETE /api/tasks/:id

router.delete("/:id", deleteTask);


module.exports = router;