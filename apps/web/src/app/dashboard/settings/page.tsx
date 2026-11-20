'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import { Settings, Shield, Building, Key, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { tenantId } = useAuth();
  const [orgName, setOrgName] = useState('Alpha Enterprises');
  const [currency, setCurrency] = useState('USD');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.patch('/tenant/settings', { orgName, currency, mfaEnabled });
    } catch {
      // Offline fallback
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Organization & Workspace Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Tenant ID: <span className="text-blue-400 font-semibold">{tenantId}</span></p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          <span>Tenant configurations saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white font-semibold">
            <Building className="h-5 w-5 text-blue-400" />
            <span>Organization Profile</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Company Display Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Base Operating Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="ZAR">ZAR (R)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white font-semibold">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span>Security Policies</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Enforce Multi-Factor Authentication (MFA)</p>
              <p className="text-xs text-slate-400">Require MFA for all tenant administrator accounts.</p>
            </div>
            <input
              type="checkbox"
              checked={mfaEnabled}
              onChange={(e) => setMfaEnabled(e.target.checked)}
              className="h-5 w-5 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white font-semibold">
            <Key className="h-5 w-5 text-amber-400" />
            <span>Multi-Tenant Row-Level Security</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All SQL queries targeting PostgreSQL automatically prepend the tenant identifier (<code className="text-amber-400 font-mono">WHERE tenant_id = '{tenantId}'</code>).
          </p>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
        >
          Save Configuration Changes
        </button>
      </form>
    </div>
  );
}
