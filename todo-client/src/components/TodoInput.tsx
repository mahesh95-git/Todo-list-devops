import React, { useState } from 'react';
import { Plus, CornerDownLeft } from 'lucide-react';

interface TodoInputProps {
  onAddTodo: (title: string) => Promise<void>;
  disabled?: boolean;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo, disabled }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || isSubmitting || disabled) return;

    try {
      setIsSubmitting(true);
      await onAddTodo(trimmed);
      setTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 relative">
      <div className="relative flex items-center shadow-lg shadow-indigo-950/30 rounded-2xl overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all border border-slate-800 bg-slate-900/90">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What task needs to be completed? (Press Enter to add)..."
          disabled={disabled || isSubmitting}
          maxLength={200}
          className="w-full bg-transparent px-5 py-4 text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none disabled:opacity-50"
        />

        <div className="pr-3 flex items-center space-x-2">
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting || disabled}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Task</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center px-2 mt-1.5 text-[11px] text-slate-500">
        <span className="hidden sm:inline-flex items-center space-x-1">
          <span>Tip: Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px] flex items-center space-x-0.5">
            <span>Enter</span>
            <CornerDownLeft className="w-2.5 h-2.5" />
          </kbd>
          <span>to submit quickly</span>
        </span>
        <span className="ml-auto">{title.length}/200</span>
      </div>
    </form>
  );
};
