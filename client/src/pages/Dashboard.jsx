// src/pages/Dashboard.jsx
// Main dashboard with stats, recent tasks, and quick add

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useTasks from "../hooks/useTasks";
import StatsCards from "../components/tasks/StatsCards";
import TaskCard from "../components/tasks/TaskCard";
import TaskModal from "../components/tasks/TaskModal";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import { SkeletonGrid } from "../components/common/SkeletonCard";
import { createTask, updateTask, deleteTask, toggleTaskStatus } from "../services/taskService";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, loading, statsLoading, refresh, loadStats } = useTasks({ limit: 6 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load stats on mount
  useEffect(() => { loadStats(); }, []);

  const handleCreate = async (data) => {
    await createTask(data);
    toast.success("Task created! 🎉");
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
    toast.success(status === "completed" ? "Task completed! ✅" : "Task marked pending.");
    refresh();
  };

  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const openCreate = () => { setEditTask(null); setModalOpen(true); };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Recent Tasks section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to start being productive!"
            action={
              <button onClick={openCreate} className="btn-primary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Task
              </button>
            }
          />
        ) : (
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
        )}
      </div>

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

      {/* FAB for mobile */}
      <button onClick={openCreate}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 sm:hidden z-20">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Dashboard;
