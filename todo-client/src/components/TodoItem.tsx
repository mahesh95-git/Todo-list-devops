import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/todo';
import { Check, Trash2, Edit3, X, CheckSquare, Square, Calendar } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (id: number, title: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (isUpdating || isDeleting) return;
    try {
      setIsUpdating(true);
      await onToggle(todo.id, !todo.completed);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed || trimmed === todo.title) {
      setIsEditing(false);
      setEditTitle(todo.title);
      return;
    }

    try {
      setIsUpdating(true);
      await onUpdate(todo.id, trimmed);
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(todo.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-slate-900/40 border-slate-800/60 opacity-75 hover:opacity-100'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
      }`}
    >
      {/* Left side: Checkbox & Title */}
      <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating || isDeleting}
          className={`flex-shrink-0 transition-all rounded-lg p-1 ${
            todo.completed
              ? 'text-emerald-400 hover:text-emerald-300'
              : 'text-slate-500 hover:text-indigo-400'
          }`}
          title={todo.completed ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {todo.completed ? (
            <CheckSquare className="w-5 h-5 fill-emerald-500/10" />
          ) : (
            <Square className="w-5 h-5" />
          )}
        </button>

        {/* Content / Edit Mode */}
        {isEditing ? (
          <div className="flex items-center space-x-2 flex-1">
            <input
              ref={editInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={200}
              className="flex-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-indigo-500 text-sm text-white focus:outline-none ring-1 ring-indigo-500"
            />
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
              title="Save (Enter)"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditTitle(todo.title);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Cancel (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            className="flex-1 min-w-0 cursor-pointer select-none"
            onDoubleClick={() => setIsEditing(true)}
          >
            <p
              className={`text-sm sm:text-base leading-relaxed break-words transition-all ${
                todo.completed
                  ? 'text-slate-400 line-through decoration-slate-600'
                  : 'text-slate-100 font-medium'
              }`}
            >
              {todo.title}
            </p>
            <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500">
              <Calendar className="w-3 h-3 text-slate-600" />
              <span>{formatDate(todo.createdAt)}</span>
              {todo.completed && (
                <span className="text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.2 rounded text-[10px]">
                  Completed
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
        {!isEditing && (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating || isDeleting}
              className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {showDeleteConfirm ? (
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-rose-500/30 animate-fadeIn">
                <span className="text-[11px] text-rose-400 px-1 font-medium hidden sm:inline">Delete?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isDeleting ? '...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isUpdating || isDeleting}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
