'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useEventsSocket } from '@/hooks/use-events-socket';
import { Building, LogOut, User, Wifi, WifiOff } from 'lucide-react';

export const Header = () => {
  const { user, tenantId, logout, isAuthenticated } = useAuth();
  const { isConnected } = useEventsSocket();

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold tracking-wider text-white">ERP Platform</span>
        {tenantId && (
          <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
            <Building className="h-3.5 w-3.5" />
            <span>{tenantId}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-medium">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <Wifi className="h-3.5 w-3.5" />
              Live Events Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-500"></span>
              <WifiOff className="h-3.5 w-3.5" />
              Events Offline
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold">{user?.email || 'Authenticated User'}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{user?.role || 'User'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
