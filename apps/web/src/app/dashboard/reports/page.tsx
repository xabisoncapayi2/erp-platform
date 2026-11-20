'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { FileText, Download, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
  const { tenantId } = useAuth();
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const reports = [
    { id: 'rep_01', name: 'Monthly Payroll & Tax Summary', category: 'HR & Payroll', format: 'CSV / PDF' },
    { id: 'rep_02', name: 'Accounts Receivable & Aging Report', category: 'Finance', format: 'PDF' },
    { id: 'rep_03', name: 'Inventory Stock Threshold & Valuation', category: 'Warehouse', format: 'CSV' },
    { id: 'rep_04', name: 'Tenant Security & Access Compliance Log', category: 'Audit', format: 'JSON / CSV' },
  ];

  const handleExport = (reportName: string) => {
    setDownloaded(reportName);
    setTimeout(() => setDownloaded(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Executive Reports & Exports</h1>
        <p className="text-sm text-slate-400 mt-1">Tenant Workspace: <span className="text-blue-400 font-semibold">{tenantId}</span></p>
      </div>

      {downloaded && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
          <span>Exporting "{downloaded}" data bundle...</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {reports.map((report) => (
          <div key={report.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400"><FileText className="h-5 w-5" /></div>
              <div>
                <h3 className="text-base font-semibold text-white">{report.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Category: {report.category} | Formats: {report.format}</p>
              </div>
            </div>
            <button
              onClick={() => handleExport(report.name)}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Download className="h-4 w-4" /> Export Report Data
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
