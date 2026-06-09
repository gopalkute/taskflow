// src/services/taskService.js
// All API calls for task operations

import api from "./api";

/**
 * Fetch tasks with optional filtering, search, and pagination
 * @param {object} params - Query parameters
 */
export const fetchTasks = (params = {}) => api.get("/tasks", { params });

/**
 * Fetch a single task by ID
 */
export const fetchTask = (id) => api.get(`/tasks/${id}`);

/**
 * Create a new task
 * @param {object} taskData - { title, description, priority, dueDate }
 */
export const createTask = (taskData) => api.post("/tasks", taskData);

/**
 * Update an existing task
 * @param {string} id - Task MongoDB ID
 * @param {object} taskData - Fields to update
 */
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);

/**
 * Delete a task permanently
 */
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

/**
 * Toggle task status between pending and completed
 */
export const toggleTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });

/**
 * Get dashboard statistics
 */
export const fetchStats = () => api.get("/tasks/stats");
