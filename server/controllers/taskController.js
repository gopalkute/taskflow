// controllers/taskController.js
// Full CRUD + status toggle + search/filter/pagination for tasks

const Task = require("../models/Task");

/**
 * @desc    Get all tasks for logged-in user (with search, filter, pagination)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    // Build filter object — always filter by the logged-in user
    const filter = { userId: req.user._id };

    if (status && ["pending", "completed"].includes(status)) filter.status = status;
    if (priority && ["low", "medium", "high"].includes(priority)) filter.priority = priority;

    // Search by title or description (case-insensitive regex)
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === "asc" ? 1 : -1;

    // Run count and fetch in parallel for performance
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      status: status || "pending",
      userId: req.user._id, // Tie task to logged-in user
    });

    res.status(201).json({ success: true, message: "Task created!", data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    // Ensure task belongs to the logged-in user before updating
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description, priority, dueDate, status },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    res.status(200).json({ success: true, message: "Task updated!", data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.status(200).json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task status (pending <-> completed)
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    res.status(200).json({ success: true, message: `Task marked as ${status}!`, data: task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics for logged-in user
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, completed, pending] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: "completed" }),
      Task.countDocuments({ userId, status: "pending" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus, getStats };
