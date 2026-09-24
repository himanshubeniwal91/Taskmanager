const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // =====================================================
    // TASK TITLE
    // =====================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // TASK DESCRIPTION
    // =====================================================

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // PRIORITY
    // =====================================================

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    // =====================================================
    // STATUS
    // =====================================================

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    // =====================================================
    // DUE DATE
    // =====================================================

    dueDate: {
      type: Date,
      required: true,
    },

    // =====================================================
    // USER
    // =====================================================

    // SOLUTION:
    // Every task belongs to one registered user.
    // req.user.userId will be stored here.

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);