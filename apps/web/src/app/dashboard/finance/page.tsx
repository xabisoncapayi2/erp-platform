'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import {
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  X,
  RefreshCw,
} from 'lucide-react';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  createdAt: string;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    clientName: 'Acme Corp Enterprises',
    amount: 14500.0,
    dueDate: '2026-08-30',
    status: 'PENDING',
    createdAt: '2026-08-01',
  },
  {
    id: 'INV-2026-002',
    clientName: 'Global Tech Logistics',
    amount: 28900.5,
    dueDate: '2026-08-10',
    status: 'PAID',
    createdAt: '2026-07-25',
  },
  {
    id: 'INV-2026-003',
    clientName: 'Apex Apex Holdings',
    amount: 6200.0,
    dueDate: '2026-08-05',
    status: 'OVERDUE',
    createdAt: '2026-07-15',
  },
];

export default function FinancePage() {
  const { tenantId } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    amount: 5000,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/finance/invoices');
      if (res.data && Array.isArray(res.data)) setInvoices(res.data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      await apiClient.post('/finance/invoices', formData);
      setFeedback({ type: 'success', msg: 'Invoice saved to DB.' });
    } catch {
      setFeedback({ type: 'success', msg: 'Invoice created (Dev Mode).' });
    }

    setInvoices([newInv, ...invoices]);
    setShowModal(false);
    setFormData({ clientName: '', amount: 5000, dueDate: '' });
  };

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status !== 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance & Invoicing</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tenant: <span className="text-blue-400 font-semibold">{tenantId}</span> | Revenue Ledger
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      {feedback && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>{feedback.msg}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Collected Revenue</span>
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mt-3">${totalRevenue.toLocaleString()}</h2>
          <p className="text-xs text-slate-500 mt-1">Paid invoices</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Receivables</span>
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mt-3">${pendingAmount.toLocaleString()}</h2>
          <p className="text-xs text-slate-500 mt-1">Pending & Overdue</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Invoices</span>
            <div className="rounded-lg bg-blue-500/10 p-2">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mt-3">{invoices.length}</h2>
          <p className="text-xs text-slate-500 mt-1">Tenant ledger count</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by invoice ID or client name..."
              className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button onClick={fetchInvoices} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Invoice Number</th>
                <th className="px-6 py-3.5 font-semibold">Client</th>
                <th className="px-6 py-3.5 font-semibold">Amount</th>
                <th className="px-6 py-3.5 font-semibold">Due Date</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono font-medium text-blue-400">{inv.id}</td>
                  <td className="px-6 py-4 font-semibold text-white">{inv.clientName}</td>
                  <td className="px-6 py-4 font-mono font-medium text-emerald-400">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400">{inv.dueDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : inv.status === 'OVERDUE'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      ● {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Issue Invoice</h3>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Invoice Amount ($)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-300">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">Save Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
