'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { LogOut, Building, ShieldCheck } from 'lucide-react';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, tenantId, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/portal/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Customer Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Client Portal</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Building className="h-3 w-3 text-blue-400" />
              Workspace: <span className="text-slate-200 font-medium">{tenantId || 'Default'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Logged in as <strong className="text-white">{user?.email || 'client@acme.com'}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
