import React from 'react';
import { ListTodo, CheckCircle2, Clock, Award } from 'lucide-react';

interface StatsOverviewProps {
  total: number;
  completed: number;
  pending: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ total, completed, pending }) => {
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Tasks */}
      <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Tasks</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">In Progress</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">{pending}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Completed</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">{completed}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Completion Rate</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-400 mt-1">{completionPercentage}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
        </div>
        {/* Mini progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
