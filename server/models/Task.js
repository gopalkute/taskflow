// models/Task.js
// Mongoose schema and model for Task collection

const mongoose = require("mongoose");

/**
 * Task Schema
 * Stores individual task data, linked to a user
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed"],
        message: "Status must be either pending or completed",
      },
      default: "pending",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    // Reference to the User who owns this task
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for efficient user-specific queries
taskSchema.index({ userId: 1, status: 1 });
// Text index for search functionality
taskSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);
