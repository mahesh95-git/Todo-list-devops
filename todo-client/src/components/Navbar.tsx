import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { healthApi } from '../api/health';
import { CheckCircle2, LogOut, User as UserIcon, Activity, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await healthApi.checkHealth();
        setServerOk(res.status === 'OK');
      } catch {
        setServerOk(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Fullstack Task Management</p>
          </div>
        </div>

        {/* Server status & User Info */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Server Status indicator */}
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-800/60 border-slate-700/60"
            title={serverOk === true ? 'Backend connected & healthy' : serverOk === false ? 'Backend unreachable' : 'Checking backend...'}
          >
            <Activity
              className={`w-3.5 h-3.5 ${
                serverOk === true
                  ? 'text-emerald-400 animate-pulse'
                  : serverOk === false
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            />
            <span className="text-slate-300 hidden md:inline">API:</span>
            <span
              className={
                serverOk === true
                  ? 'text-emerald-400 font-semibold'
                  : serverOk === false
                  ? 'text-rose-400 font-semibold'
                  : 'text-amber-400'
              }
            >
              {serverOk === true ? 'Online' : serverOk === false ? 'Offline' : 'Connecting'}
            </span>
          </div>

          {user && (
            <div className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                    <span>{user.name || 'User'}</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px]" title={user.email}>
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
