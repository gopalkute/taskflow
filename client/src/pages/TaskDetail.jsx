// src/pages/TaskDetail.jsx
// Single task detail view page

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTask, updateTask, deleteTask, toggleTaskStatus } from "../services/taskService";
import { formatDate, priorityBadge, statusBadge, capitalize } from "../utils/helpers";
import TaskModal from "../components/tasks/TaskModal";
import ConfirmModal from "../components/common/ConfirmModal";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchTask(id);
        setTask(res.data.data);
      } catch {
        toast.error("Task not found.");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleEdit = async (data) => {
    const res = await updateTask(task._id, data);
    setTask(res.data.data);
    toast.success("Task updated!");
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteTask(task._id);
      toast.success("Task deleted.");
      navigate("/tasks");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      const res = await toggleTaskStatus(task._id, newStatus);
      setTask(res.data.data);
      toast.success(newStatus === "completed" ? "Task completed! ✅" : "Task marked pending.");
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tasks
      </button>

      <div className="card p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-2xl font-bold text-gray-900 dark:text-white ${task.status === "completed" ? "line-through text-gray-400 dark:text-gray-500" : ""}`}>
              {task.title}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Created {formatDate(task.createdAt, "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(task.status)}`}>
              {capitalize(task.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityBadge(task.priority)}`}>
              {capitalize(task.priority)} Priority
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {task.description || <span className="text-gray-400 dark:text-gray-500 italic">No description provided.</span>}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Due Date</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {task.dueDate ? formatDate(task.dueDate) : "—"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Last Updated</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          {/* Toggle status */}
          <button onClick={handleToggle} disabled={toggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              task.status === "completed"
                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100"
                : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
            }`}>
            {toggling ? <Spinner size="sm" /> : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={task.status === "completed" ? "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M5 13l4 4L19 7"} />
              </svg>
            )}
            {task.status === "completed" ? "Mark Pending" : "Mark Complete"}
          </button>

          <button onClick={() => setModalOpen(true)} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Task
          </button>

          <button onClick={() => setDeleteOpen(true)} className="btn-danger ml-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Modals */}
      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleEdit} editTask={task} />
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Task?"
        message={`"${task.title}" will be permanently deleted.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default TaskDetail;
