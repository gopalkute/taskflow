// validators/taskValidators.js
// express-validator rules for task routes

const { body, param } = require("express-validator");

/**
 * Validation rules for creating a task
 */
const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Status must be pending or completed"),
];

/**
 * Validation rules for updating a task (all fields optional)
 */
const updateTaskValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

/**
 * Validation for status toggle
 */
const statusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "completed"])
    .withMessage("Status must be pending or completed"),
];

module.exports = { createTaskValidator, updateTaskValidator, statusValidator };
