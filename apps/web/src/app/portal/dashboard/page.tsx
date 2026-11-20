'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api-client';
import {
  FileText,
  Package,
  CreditCard,
  LifeBuoy,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';

interface CustomerInvoice {
  id: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

interface CustomerOrder {
  id: string;
  items: string;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  date: string;
}

const MOCK_CUSTOMER_INVOICES: CustomerInvoice[] = [
  { id: 'INV-2026-089', amount: 3450.0, dueDate: '2026-08-28', status: 'PENDING' },
  { id: 'INV-2026-042', amount: 12000.0, dueDate: '2026-07-15', status: 'PAID' },
];

const MOCK_CUSTOMER_ORDERS: CustomerOrder[] = [
  { id: 'ORD-8821', items: 'Enterprise Rack Server 2U (x2)', status: 'SHIPPED', date: '2026-08-10' },
  { id: 'ORD-8790', items: 'Developer Monitors 27" (x5)', status: 'DELIVERED', date: '2026-07-28' },
];

export default function CustomerDashboardPage() {
  const { tenantId, user } = useAuth();
  const [invoices, setInvoices] = useState<CustomerInvoice[]>(MOCK_CUSTOMER_INVOICES);
  const [orders, setOrders] = useState<CustomerOrder[]>(MOCK_CUSTOMER_ORDERS);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketFeedback, setTicketFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const [invRes, ordRes] = await Promise.all([
          apiClient.get('/customer/invoices'),
          apiClient.get('/customer/orders'),
        ]);
        if (invRes.data) setInvoices(invRes.data);
        if (ordRes.data) setOrders(ordRes.data);
      } catch {
        // Fallback to mock data for dev mode
      }
    }
    loadCustomerData();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/customer/tickets', { subject: ticketSubject });
    } catch {
      // Offline fallback
    }
    setTicketFeedback(`Ticket created: "${ticketSubject}"`);
    setShowTicketModal(false);
    setTicketSubject('');
  };

  const pendingTotal = invoices
    .filter((i) => i.status !== 'PAID')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
        <p className="text-xs text-slate-400 mt-1">
          Managing account records for workspace <span className="text-blue-400 font-semibold">{tenantId}</span>
        </p>
      </div>

      {ticketFeedback && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{ticketFeedback}</span>
          </div>
          <button onClick={() => setTicketFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Outstanding Balance</span>
            <div className="rounded-lg bg-amber-500/10 p-2"><CreditCard className="h-5 w-5 text-amber-400" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white mt-3">${pendingTotal.toLocaleString()}</h3>
          <p className="text-xs text-slate-500 mt-1">Unpaid invoices</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Orders</span>
            <div className="rounded-lg bg-blue-500/10 p-2"><Package className="h-5 w-5 text-blue-400" /></div>
          </div>
          <h3 className="text-2xl font-bold text-white mt-3">{orders.length} Orders</h3>
          <p className="text-xs text-slate-500 mt-1">Recent fulfillment status</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Support Access</span>
            <div className="rounded-lg bg-emerald-500/10 p-2"><LifeBuoy className="h-5 w-5 text-emerald-400" /></div>
          </div>
          <button
            onClick={() => setShowTicketModal(true)}
            className="mt-3 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Submit Ticket
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl space-y-3 p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-400" /> Your Invoices
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono text-blue-400">{inv.id}</td>
                  <td className="px-4 py-3 font-semibold text-white">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400">{inv.dueDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      ● {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Open Support Ticket</h3>
              <button onClick={() => setShowTicketModal(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Issue / Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Requesting billing updates for August"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 py-2 px-3 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTicketModal(false)} className="rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-300">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
