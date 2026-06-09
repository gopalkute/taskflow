// src/utils/helpers.js
// Shared utility functions

import { format, isValid, parseISO } from "date-fns";

/**
 * Format a date string or Date object to readable format
 * @param {string|Date} date
 * @param {string} fmt - date-fns format string
 */
export const formatDate = (date, fmt = "MMM d, yyyy") => {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) ? format(d, fmt) : "—";
};

/**
 * Return Tailwind badge classes based on priority
 */
export const priorityBadge = (priority) => {
  const map = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  return map[priority] || map.medium;
};

/**
 * Return Tailwind badge classes based on status
 */
export const statusBadge = (status) => {
  return status === "completed"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
};

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

/**
 * Truncate text to a maximum length
 */
export const truncate = (str, max = 80) =>
  str && str.length > max ? str.slice(0, max) + "…" : str;
