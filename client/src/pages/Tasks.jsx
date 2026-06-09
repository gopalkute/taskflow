// src/pages/Tasks.jsx
// Full tasks page with search, filter, pagination

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useTasks from "../hooks/useTasks";
import useDebounce from "../hooks/useDebounce";
import TaskCard from "../components/tasks/TaskCard";
import TaskModal from "../components/tasks/TaskModal";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import { SkeletonGrid } from "../components/common/SkeletonCard";
import { createTask, updateTask, deleteTask, toggleTaskStatus } from "../services/taskService";
import toast from "react-hot-toast";

const Tasks = () => {
  const location = useLocation();
  const queryStatus = new URLSearchParams(location.search).get("status") || "";

  const { tasks, loading, pagination, filters, updateFilter, setPage, refresh } = useTasks({ status: queryStatus });

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Apply debounced search to filter
  useEffect(() => { updateFilter("search", debouncedSearch); }, [debouncedSearch]);

  // Sync status from URL
  useEffect(() => { updateFilter("status", queryStatus); }, [queryStatus]);

  const handleCreate = async (data) => {
    await createTask(data);
    toast.success("Task created!");
    refresh();
  };

  const handleEdit = async (data) => {
    await updateTask(editTask._id, data);
    toast.success("Task updated!");
    refresh();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteTask(deleteTarget._id);
      toast.success("Task deleted.");
      setDeleteTarget(null);
      refresh();
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (id, status) => {
    await toggleTaskStatus(id, status);
    toast.success(status === "completed" ? "Task completed! ✅" : "Task set to pending.");
    refresh();
  };

  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const openCreate = () => { setEditTask(null); setModalOpen(true); };

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {filters.status === "completed" ? "Completed Tasks" : filters.status === "pending" ? "Pending Tasks" : "All Tasks"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total} task{pagination.total !== 1 ? "s" : ""} found
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..." className="input-field pl-9" />
        </div>

        {/* Status filter */}
        <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}
          className="input-field sm:w-40">
          <option value="">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="completed">✅ Completed</option>
        </select>

        {/* Priority filter */}
        <select value={filters.priority} onChange={(e) => updateFilter("priority", e.target.value)}
          className="input-field sm:w-40">
          <option value="">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        {/* Clear filters */}
        {(filters.search || filters.status || filters.priority) && (
          <button onClick={() => { setSearchInput(""); updateFilter("status", ""); updateFilter("priority", ""); }}
            className="btn-secondary flex-shrink-0">
            Clear
          </button>
        )}
      </div>

      {/* Task Grid */}
      {loading ? (
        <SkeletonGrid count={9} />
      ) : tasks.length === 0 ? (
        <EmptyState
          title={filters.search ? `No results for "${filters.search}"` : "No tasks found"}
          description={filters.search ? "Try a different search term or clear your filters." : "Create a task to get started."}
          action={
            !filters.search && (
              <button onClick={openCreate} className="btn-primary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={handleToggle}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSubmit={editTask ? handleEdit : handleCreate}
        editTask={editTask}
      />
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Task?"
        message={`"${deleteTarget?.title}" will be permanently deleted.`}
        confirmText="Delete"
      />

      {/* FAB */}
      <button onClick={openCreate}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 sm:hidden z-20">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Tasks;
