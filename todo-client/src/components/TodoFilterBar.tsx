import React from 'react';
import { Search, ArrowUpDown, X, Filter } from 'lucide-react';
import { TodoQueryParams } from '../types/todo';

interface TodoFilterBarProps {
  params: TodoQueryParams;
  onChange: (newParams: Partial<TodoQueryParams>) => void;
  activeCount?: number;
  completedCount?: number;
  totalCount?: number;
}

export const TodoFilterBar: React.FC<TodoFilterBarProps> = ({
  params,
  onChange,
  activeCount = 0,
  completedCount = 0,
  totalCount = 0,
}) => {
  const currentCompleted = params.completed ?? 'all';
  const currentSortBy = params.sortBy ?? 'createdAt';
  const currentSortOrder = params.sortOrder ?? 'desc';
  const currentSort = `${currentSortBy}_${currentSortOrder}`;

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('_') as ['createdAt' | 'title', 'asc' | 'desc'];
    onChange({ sortBy, sortOrder, page: 1 });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-5 space-y-3">
      {/* Top row: Search input and Sorting */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={params.search || ''}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            placeholder="Search tasks by title..."
            className="w-full pl-10 pr-9 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {params.search && (
            <button
              onClick={() => onChange({ search: '', page: 1 })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-slate-950/60 border border-slate-800/80 rounded-xl pl-8 pr-8 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="title_asc">Title (A - Z)</option>
              <option value="title_desc">Title (Z - A)</option>
            </select>
          </div>

          {/* Items per page selector */}
          <select
            value={params.limit || 10}
            onChange={(e) => onChange({ limit: Number(e.target.value), page: 1 })}
            className="appearance-none bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            title="Items per page"
          >
            <option value={5}>5 / pg</option>
            <option value={10}>10 / pg</option>
            <option value={20}>20 / pg</option>
            <option value={50}>50 / pg</option>
          </select>
        </div>
      </div>

      {/* Bottom row: Filter Tabs */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 flex-wrap gap-2">
        <div className="flex items-center space-x-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onChange({ completed: 'all', page: 1 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              currentCompleted === 'all'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>All</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => onChange({ completed: false, page: 1 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              currentCompleted === false
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Active</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => onChange({ completed: true, page: 1 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              currentCompleted === true
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Completed</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
              {completedCount}
            </span>
          </button>
        </div>

        {params.search && (
          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <span>Filtering by query:</span>
            <span className="text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              "{params.search}"
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
