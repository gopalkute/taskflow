// src/hooks/useTasks.js
// Custom hook for fetching and managing tasks list

import { useState, useEffect, useCallback } from "react";
import { fetchTasks, fetchStats } from "../services/taskService";

/**
 * useTasks hook
 * Manages tasks list, filters, search, pagination, and stats
 * @param {object} initialFilters - Default filter values
 */
const useTasks = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 9 });
  const [filters, setFilters] = useState({ status: "", priority: "", search: "", page: 1, ...initialFilters });

  // Load tasks whenever filters change
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Strip empty filter values from query params
      const cleanFilters = Object.fromEntries(
        Object.entries({ ...filters, limit: 9 }).filter(([, v]) => v !== "")
      );
      const res = await fetchTasks(cleanFilters);
      setTasks(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load stats separately (for dashboard cards)
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetchStats();
      setStats(res.data.data);
    } catch {
      // Non-critical — fail silently
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const setPage = (page) => setFilters((prev) => ({ ...prev, page }));

  const refresh = () => { loadTasks(); loadStats(); };

  return { tasks, stats, loading, statsLoading, error, pagination, filters, updateFilter, setPage, refresh, loadStats };
};

export default useTasks;
