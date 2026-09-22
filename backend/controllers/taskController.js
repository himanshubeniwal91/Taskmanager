// =====================================================
// IMPORTS
// =====================================================

const mongoose = require("mongoose");
const Task = require("../models/Task");
const asyncHandler = require("../middleware/asyncHandler");

// =====================================================
// GET ALL TASKS
// GET /api/tasks?page=1&limit=5
// =====================================================

const getTasks = asyncHandler(async (req, res) => {
  // =================================================
  // PAGINATION
  // =================================================

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  // Calculate records to skip
  const skip = (page - 1) * limit;

  // =================================================
  // QUERY PARAMETERS
  // =================================================

  const {
    search,
    status,
    priority,
    sort,
  } = req.query;

  // =================================================
  // BUILD FILTER
  // =================================================

  const filter = {};

  // =================================================
  // SEARCH BY TITLE
  // =================================================

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  // =================================================
  // STATUS FILTER
  // =================================================

  if (status && status !== "All") {
    filter.status = status;
  }

  // =================================================
  // PRIORITY FILTER
  // =================================================

  if (priority && priority !== "All") {
    filter.priority = priority;
  }

  // =================================================
  // SORT
  // =================================================

  // Default:
  // Latest created task first
  let sortOption = {
    createdAt: -1,
  };

  // Due date ascending
  if (sort === "asc") {
    sortOption = {
      dueDate: 1,
    };
  }

  // Due date descending
  if (sort === "desc") {
    sortOption = {
      dueDate: -1,
    };
  }

  // =================================================
  // COUNT FILTERED TASKS
  // =================================================

  const totalTasks = await Task.countDocuments(filter);

  // =================================================
  // FETCH TASKS
  // =================================================

  const tasks = await Task.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  // =================================================
  // TOTAL PAGES
  // =================================================

  const totalPages = Math.ceil(
    totalTasks / limit
  );

  // =================================================
  // RESPONSE
  // =================================================

  res.status(200).json({
    success: true,

    data: tasks,

    pagination: {
      page,
      limit,
      totalTasks,
      totalPages,
    },

    filters: {
      search: search || "",
      status: status || "All",
      priority: priority || "All",
      sort: sort || "",
    },
  });
});

// =====================================================
// GET SINGLE TASK
// GET /api/tasks/:id
// =====================================================

const getTaskById = asyncHandler(async (req, res) => {
  // =================================================
  // VALIDATE OBJECT ID
  // =================================================

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  }

  // =================================================
  // FIND TASK
  // =================================================

  const task = await Task.findById(req.params.id);

  // =================================================
  // TASK NOT FOUND
  // =================================================

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // =================================================
  // SUCCESS RESPONSE
  // =================================================

  res.status(200).json({
    success: true,
    data: task,
  });
});

// =====================================================
// CREATE TASK
// POST /api/tasks
// =====================================================

const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    priority,
    status,
    dueDate,
  } = req.body;

  // =================================================
  // REQUIRED FIELD VALIDATION
  // =================================================

  if (
    !title ||
    !description ||
    !dueDate
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Title, description and due date are required",
    });
  }

  // =================================================
  // PRIORITY VALIDATION
  // =================================================

  const validPriorities = [
    "High",
    "Medium",
    "Low",
  ];

  if (
    priority &&
    !validPriorities.includes(priority)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Priority must be High, Medium or Low",
    });
  }

  // =================================================
  // STATUS VALIDATION
  // =================================================

  const validStatuses = [
    "Pending",
    "In Progress",
    "Completed",
  ];

  if (
    status &&
    !validStatuses.includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Status must be Pending, In Progress or Completed",
    });
  }

  // =================================================
  // CREATE TASK
  // =================================================

  const task = await Task.create({
    title: title.trim(),
    description: description.trim(),
    priority: priority || "Medium",
    status: status || "Pending",
    dueDate,
  });

  // =================================================
  // SUCCESS RESPONSE
  // =================================================

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

// =====================================================
// UPDATE TASK
// PUT /api/tasks/:id
// =====================================================

const updateTask = asyncHandler(async (req, res) => {
  // =================================================
  // VALIDATE OBJECT ID
  // =================================================

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  }

  const {
    title,
    description,
    priority,
    status,
    dueDate,
  } = req.body;

  // =================================================
  // REQUIRED FIELD VALIDATION
  // =================================================

  if (
    !title ||
    !description ||
    !dueDate
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Title, description and due date are required",
    });
  }

  // =================================================
  // PRIORITY VALIDATION
  // =================================================

  const validPriorities = [
    "High",
    "Medium",
    "Low",
  ];

  if (
    priority &&
    !validPriorities.includes(priority)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Priority must be High, Medium or Low",
    });
  }

  // =================================================
  // STATUS VALIDATION
  // =================================================

  const validStatuses = [
    "Pending",
    "In Progress",
    "Completed",
  ];

  if (
    status &&
    !validStatuses.includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Status must be Pending, In Progress or Completed",
    });
  }

  // =================================================
  // UPDATE TASK
  // =================================================

  const task = await Task.findByIdAndUpdate(
    req.params.id,

    {
      title: title.trim(),
      description: description.trim(),
      priority: priority || "Medium",
      status: status || "Pending",
      dueDate,
    },

    {
      new: true,
      runValidators: true,
    }
  );

  // =================================================
  // TASK NOT FOUND
  // =================================================

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // =================================================
  // SUCCESS RESPONSE
  // =================================================

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

// =====================================================
// DELETE TASK
// DELETE /api/tasks/:id
// =====================================================

const deleteTask = asyncHandler(async (req, res) => {
  // =================================================
  // VALIDATE OBJECT ID
  // =================================================

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  }

  // =================================================
  // DELETE TASK
  // =================================================

  const task = await Task.findByIdAndDelete(
    req.params.id
  );

  // =================================================
  // TASK NOT FOUND
  // =================================================

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // =================================================
  // SUCCESS RESPONSE
  // =================================================

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: task,
  });
});

// =====================================================
// GET TASK STATISTICS
// GET /api/tasks/stats
// =====================================================

const getTaskStats = asyncHandler(async (req, res) => {
  // =================================================
  // TOTAL TASKS
  // =================================================

  const totalTasks =
    await Task.countDocuments();

  // =================================================
  // PENDING TASKS
  // =================================================

  const pendingTasks =
    await Task.countDocuments({
      status: "Pending",
    });

  // =================================================
  // COMPLETED TASKS
  // =================================================

  const completedTasks =
    await Task.countDocuments({
      status: "Completed",
    });

  // =================================================
  // OVERDUE TASKS
  // =================================================

  // Overdue means:
  // due date is before current date/time
  // AND task is not completed

  const overdueTasks =
    await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

  // =================================================
  // SUCCESS RESPONSE
  // =================================================

  res.status(200).json({
    success: true,

    data: {
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
    },
  });
});

// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};