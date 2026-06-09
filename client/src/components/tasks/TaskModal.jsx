// src/components/tasks/TaskModal.jsx
// Modal for creating and editing tasks

import { useState, useEffect } from "react";
import Spinner from "../common/Spinner";

const INITIAL_FORM = { title: "", description: "", priority: "medium", dueDate: "", status: "pending" };

const TaskModal = ({ isOpen, onClose, onSubmit, editTask = null }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(editTask);

  // Pre-fill form when editing
  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || "",
        description: editTask.description || "",
        priority: editTask.priority || "medium",
        status: editTask.status || "pending",
        dueDate: editTask.dueDate ? editTask.dueDate.split("T")[0] : "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [editTask, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.trim().length < 2) errs.title = "Title must be at least 2 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-slide-in"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEdit ? "Edit Task" : "Create New Task"}
          </h2>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="label-text">Title <span className="text-red-500">*</span></label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Design login page"
              className={`input-field ${errors.title ? "border-red-400 focus:ring-red-400" : ""}`} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label-text">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Optional details about this task..."
              className="input-field resize-none" />
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="label-text">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="label-text">Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
              className="input-field" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <><Spinner size="sm" /> Saving...</> : isEdit ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
