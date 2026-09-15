const Task = require("../models/Task");


// =====================================================
// GET ALL TASKS
// GET /api/tasks?page=1&limit=5
// =====================================================

const getTasks = async (req, res) => {

  try {

    // =================================================
    // PAGINATION
    // =================================================

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

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
    // BUILD MONGODB FILTER
    // =================================================

    const filter = {};


    // SEARCH BY TITLE

    if (search) {

      filter.title = {
        $regex: search,
        $options: "i",
      };

    }


    // STATUS FILTER

    if (status && status !== "All") {

      filter.status = status;

    }


    // PRIORITY FILTER

    if (priority && priority !== "All") {

      filter.priority = priority;

    }


    // =================================================
    // SORT
    // =================================================

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
    // TOTAL FILTERED TASKS
    // =================================================

    const totalTasks =
      await Task.countDocuments(filter);


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
// GET /api/tasks/:id
// =====================================================

const getTaskById = async (req, res) => {

  try {

    const task = await Task.findById(
      req.params.id
    );


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
// POST /api/tasks
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


    const task = await Task.create({

      title,
      description,
      priority,
      status,
      dueDate,

    });


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
// PUT /api/tasks/:id
// =====================================================

const updateTask = async (req, res) => {

  try {

    const task = await Task.findByIdAndUpdate(

      req.params.id,

      req.body,

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
// DELETE /api/tasks/:id
// =====================================================

const deleteTask = async (req, res) => {

  try {

    const task = await Task.findByIdAndDelete(
      req.params.id
    );


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
// EXPORT ALL FUNCTIONS
// =====================================================

module.exports = {

  getTasks,

  getTaskById,

  createTask,

  updateTask,

  deleteTask,

};