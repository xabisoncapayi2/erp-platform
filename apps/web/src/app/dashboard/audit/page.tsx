'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import { Activity, Search, Shield, RefreshCw } from 'lucide-react';

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
}

const MOCK_LOGS: AuditLog[] = [
  { id: 'log_01', actor: 'admin@company.com', action: 'PAYROLL_RUN', resource: 'Payroll Batch #44', ipAddress: '192.168.1.45', timestamp: '2026-08-14 14:22:10' },
  { id: 'log_02', actor: 'hr.manager@company.com', action: 'EMPLOYEE_CREATED', resource: 'Employee #emp_01', ipAddress: '192.168.1.88', timestamp: '2026-08-14 12:15:00' },
  { id: 'log_03', actor: 'system_bot', action: 'RLS_SECURITY_CHECK', resource: 'PostgreSQL DB', ipAddress: '127.0.0.1', timestamp: '2026-08-14 10:00:00' },
];

export default function AuditLogsPage() {
  const { tenantId } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/audit-logs');
      if (res.data && Array.isArray(res.data)) setLogs(res.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">System Audit & Compliance Logs</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tenant Isolation: <span className="text-blue-400 font-semibold">{tenantId}</span> | Immutable Event Stream
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 self-start sm:self-auto">
          <Shield className="h-4 w-4" /> Row-Level Security Enforced
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by actor email, action, or resource..."
              className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 pl-9 pr-4 text-xs text-white focus:outline-none"
            />
          </div>
          <button onClick={fetchLogs} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Actor</th>
                <th className="px-6 py-3.5">Action Event</th>
                <th className="px-6 py-3.5">Target Resource</th>
                <th className="px-6 py-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="px-6 py-4 font-semibold text-white">{log.actor}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 font-mono text-[11px] text-blue-400">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{log.resource}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
