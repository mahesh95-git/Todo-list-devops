import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { todoApi } from '../api/todo';
import { getErrorMessage } from '../api/client';
import { Todo, TodoQueryParams, PaginationMeta } from '../types/todo';
import { StatsOverview } from './StatsOverview';
import { TodoInput } from './TodoInput';
import { TodoFilterBar } from './TodoFilterBar';
import { TodoItem } from './TodoItem';
import { Pagination } from './Pagination';
import { ToastContainer, ToastMessage, ToastType } from './Toast';
import { RefreshCw, Sparkles, Inbox } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  // Filter & Query Parameters State
  const [queryParams, setQueryParams] = useState<TodoQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    completed: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Overall counts for stats
  const [stats, setStats] = useState<{ total: number; completed: number; pending: number }>({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Debounce search timer
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch full stats summary (unfiltered)
  const fetchStats = useCallback(async () => {
    try {
      // Fetch up to 100 recent items to compute accurate counts
      const res = await todoApi.getTodos({ limit: 100, page: 1 });
      const total = res.meta.total;
      const completedCount = res.todos.filter((t) => t.completed).length;
      const pendingCount = Math.max(0, total - completedCount);
      setStats({
        total,
        completed: completedCount,
        pending: pendingCount,
      });
    } catch {
      // silently ignore stats error
    }
  }, []);

  // Fetch paginated & filtered todos
  const fetchTodos = useCallback(
    async (params: TodoQueryParams, showSpinner = true) => {
      if (showSpinner) setIsLoading(true);
      try {
        const res = await todoApi.getTodos(params);
        setTodos(res.todos);
        setMeta(res.meta);
      } catch (err) {
        showToast('error', getErrorMessage(err));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Trigger fetch when queryParams changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce if user is typing search query
    if (queryParams.search) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchTodos(queryParams);
      }, 350);
    } else {
      fetchTodos(queryParams);
    }

    fetchStats();

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [queryParams, fetchTodos, fetchStats]);

  const handleParamChange = (newParams: Partial<TodoQueryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchTodos(queryParams, false), fetchStats()]);
    showToast('info', 'Tasks synchronized');
  };

  // Create Todo
  const handleAddTodo = async (title: string) => {
    try {
      const created = await todoApi.createTodo({ title });
      showToast('success', `Created "${created.title}"`);
      // Refresh list and stats
      await Promise.all([fetchTodos(queryParams, false), fetchStats()]);
    } catch (err) {
      showToast('error', getErrorMessage(err));
      throw err;
    }
  };

  // Toggle Completed
  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t))
      );

      const updated = await todoApi.updateTodo(id, { completed });
      showToast('success', updated.completed ? 'Task completed!' : 'Task marked as active');
      fetchStats();
    } catch (err) {
      showToast('error', getErrorMessage(err));
      // Revert on error
      fetchTodos(queryParams, false);
    }
  };

  // Update Title
  const handleUpdateTodo = async (id: number, title: string) => {
    try {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title } : t))
      );
      await todoApi.updateTodo(id, { title });
      showToast('success', 'Task updated');
    } catch (err) {
      showToast('error', getErrorMessage(err));
      fetchTodos(queryParams, false);
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id);
      showToast('info', 'Task deleted');
      // If deleting the last item on a page > 1, go back one page
      if (todos.length === 1 && meta.page > 1) {
        setQueryParams((prev) => ({ ...prev, page: prev.page! - 1 }));
      } else {
        fetchTodos(queryParams, false);
      }
      fetchStats();
    } catch (err) {
      showToast('error', getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Hello, {user?.name || user?.email.split('@')[0] || 'Friend'}!</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Here is your task breakdown and action items for today.
          </p>
        </div>

        {/* Sync / Refresh Button */}
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing || isLoading}
          className="self-start sm:self-center inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 rounded-xl text-xs font-semibold text-slate-300 transition-all disabled:opacity-50"
          title="Refresh task list"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Sync</span>
        </button>
      </div>

      {/* Stats Cards */}
      <StatsOverview
        total={stats.total}
        completed={stats.completed}
        pending={stats.pending}
      />

      {/* Todo Input */}
      <TodoInput onAddTodo={handleAddTodo} />

      {/* Filters, Search & Sort */}
      <TodoFilterBar
        params={queryParams}
        onChange={handleParamChange}
        totalCount={stats.total}
        activeCount={stats.pending}
        completedCount={stats.completed}
      />

      {/* Todo List Area */}
      <div className="space-y-2.5">
        {isLoading ? (
          // Skeleton Loaders
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse flex items-center px-4 space-x-4"
              >
                <div className="w-5 h-5 rounded bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="w-2/5 h-3.5 bg-slate-800 rounded" />
                  <div className="w-1/4 h-2.5 bg-slate-800/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : todos.length === 0 ? (
          // Empty State
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-10 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-200">No tasks found</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1.5">
              {queryParams.search
                ? `No tasks matched "${queryParams.search}". Try refining your query.`
                : queryParams.completed !== 'all'
                ? `You don't have any ${queryParams.completed ? 'completed' : 'active'} tasks.`
                : 'Your todo list is clear! Add your first task above to get started.'}
            </p>
          </div>
        ) : (
          // List of Todos
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>

      {/* Pagination Bar */}
      {!isLoading && meta.total > 0 && (
        <Pagination
          meta={meta}
          onPageChange={(page) => handleParamChange({ page })}
        />
      )}
    </div>
  );
};
