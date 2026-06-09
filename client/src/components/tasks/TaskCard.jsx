// src/components/tasks/TaskCard.jsx
// Individual task card with status toggle, edit, delete actions

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, priorityBadge, statusBadge, capitalize, truncate } from "../../utils/helpers";

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const [toggling, setToggling] = useState(false);
  const navigate = useNavigate();
  const isCompleted = task.status === "completed";

  const handleToggle = async (e) => {
    e.stopPropagation();
    setToggling(true);
    await onToggleStatus(task._id, isCompleted ? "pending" : "completed");
    setToggling(false);
  };

  return (
    <div
      className={`card p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-md cursor-pointer group ${
        isCompleted ? "opacity-80" : ""
      }`}
      onClick={() => navigate(`/tasks/${task._id}`)}>

      {/* Header: title + status badge */}
      <div className="flex items-start gap-2 justify-between">
        <h3 className={`font-semibold text-gray-900 dark:text-white text-sm leading-snug flex-1 ${
          isCompleted ? "line-through text-gray-400 dark:text-gray-500" : ""
        }`}>
          {task.title}
        </h3>
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${statusBadge(task.status)}`}>
          {capitalize(task.status)}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {truncate(task.description, 100)}
        </p>
      )}

      {/* Priority + Due Date */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge(task.priority)}`}>
          {capitalize(task.priority)}
        </span>
        {task.dueDate && (
          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {/* Footer: created date + action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(task.createdAt)}</span>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Toggle completion */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={isCompleted ? "Mark pending" : "Mark complete"}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              isCompleted
                ? "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            }`}>
            {isCompleted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          {/* Edit */}
          <button onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Delete */}
          <button onClick={(e) => { e.stopPropagation(); onDelete(task); }}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
