const mongoose = require("mongoose");
const Task = require("../models/Task");

// =====================================================
// GET ALL TASKS
// =====================================================

const getTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const {
      search,
      status,
      priority,
      sort,
    } = req.query;

    // ===================================================
    // FILTER
    // ===================================================

    const filter = {
      // SOLUTION:
      // Only fetch tasks belonging to logged-in user.
      user: req.user.userId,
    };

    // Search by title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Status filter
    if (status && status !== "All") {
      filter.status = status;
    }

    // Priority filter
    if (priority && priority !== "All") {
      filter.priority = priority;
    }

    // ===================================================
    // SORT
    // ===================================================

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "asc") {
      sortOption = {
        dueDate: 1,
      };
    }

    if (sort === "desc") {
      sortOption = {
        dueDate: -1,
      };
    }

    // ===================================================
    // TOTAL TASKS
    // ===================================================

    const totalTasks = await Task.countDocuments(filter);

    // ===================================================
    // FETCH TASKS
    // ===================================================

    const tasks = await Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // ===================================================
    // TOTAL PAGES
    // ===================================================

    const totalPages = Math.ceil(
      totalTasks / limit
    );

    // ===================================================
    // RESPONSE
    // ===================================================

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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE TASK
// =====================================================

const getTaskById = async (req, res) => {
  try {

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,

      // SOLUTION:
      // User can only access their own task.
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE TASK
// =====================================================

const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      priority,
      status,
      dueDate,
    } = req.body;

    // ===================================================
    // REQUIRED FIELD VALIDATION
    // ===================================================

    if (!title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and due date are required",
      });
    }

    // ===================================================
    // PRIORITY VALIDATION
    // ===================================================

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

    // ===================================================
    // STATUS VALIDATION
    // ===================================================

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

    // ===================================================
    // CREATE TASK
    // ===================================================

    const task = await Task.create({

      title: title.trim(),

      description: description.trim(),

      priority: priority || "Medium",

      status: status || "Pending",

      dueDate,

      // SOLUTION:
      // Attach task to currently logged-in user.
      user: req.user.userId,
    });

    // ===================================================
    // RESPONSE
    // ===================================================

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE TASK
// =====================================================

const updateTask = async (req, res) => {
  try {

    // Validate MongoDB ID
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

    // ===================================================
    // REQUIRED FIELD VALIDATION
    // ===================================================

    if (!title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description and due date are required",
      });
    }

    // ===================================================
    // PRIORITY VALIDATION
    // ===================================================

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

    // ===================================================
    // STATUS VALIDATION
    // ===================================================

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

    // ===================================================
    // UPDATE TASK
    // ===================================================

    const task = await Task.findOneAndUpdate(

      {
        _id: req.params.id,

        // SOLUTION:
        // Only update task belonging to logged-in user.
        user: req.user.userId,
      },

      {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate,
      },

      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // ===================================================
    // RESPONSE
    // ===================================================

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE TASK
// =====================================================

const deleteTask = async (req, res) => {
  try {

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,

      // SOLUTION:
      // Only delete task belonging to logged-in user.
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// =====================================================
// GET TASK STATISTICS
// =====================================================

const getTaskStats = async (req, res) => {
  try {

    // SOLUTION:
    // Statistics are now only for logged-in user.

    const userId = req.user.userId;

    const totalTasks = await Task.countDocuments({
      user: userId,
    });

    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: "Pending",
    });

    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "Completed",
    });

    const overdueTasks = await Task.countDocuments({
      user: userId,

      dueDate: {
        $lt: new Date(),
      },

      status: {
        $ne: "Completed",
      },
    });

    // ===================================================
    // RESPONSE
    // ===================================================

    res.status(200).json({
      success: true,

      data: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch task statistics",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};