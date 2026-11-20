'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { erpEngine, SystemEvent, ERPState } from '@/lib/erp-engine';
import {
  Zap,
  Boxes,
  DollarSign,
  Truck,
  Activity,
  Cpu,
  ArrowRight,
  Play,
  CheckCircle2,
  Building2,
  Factory,
  ShoppingBag,
} from 'lucide-react';

export default function UnifiedWorkflowPage() {
  const { tenantId } = useAuth();
  const [systemState, setSystemState] = useState<ERPState>(erpEngine.getState());
  const [events, setEvents] = useState<SystemEvent[]>(erpEngine.getEventLog());
  const [isSimulating, setIsSimulating] = useState(false);

  // Trigger automated real-time cross-department workflow
  const triggerAutomatedWorkflow = () => {
    setIsSimulating(true);
    const orderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const saleAmount = 3499.00;
    const itemsQty = 1;

    setTimeout(() => {
      const result = erpEngine.processCustomerSale(orderNum, saleAmount, itemsQty);
      setSystemState(result.state);
      setEvents(result.events);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400 uppercase">
              Central Data Engine
            </span>
            <span className="text-xs text-slate-500">Tenant: <strong className="text-slate-200">{tenantId}</strong></span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Real-Time Sync & Workflow Hub</h1>
          <p className="text-xs text-slate-400">
            Demonstrating unified cross-departmental state sync across Finance, Inventory, Logistics, and Sales.
          </p>
        </div>

        <button
          onClick={triggerAutomatedWorkflow}
          disabled={isSimulating}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white hover:opacity-90 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
        >
          <Play className={`h-4 w-4 ${isSimulating ? 'animate-spin' : 'fill-white'}`} />
          {isSimulating ? 'Executing Pipeline...' : 'Simulate Live Cross-Dept Order'}
        </button>
      </div>

      {/* Shared Central Database State Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Finance & Cash</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mt-2">${systemState.cashBalance.toLocaleString()}</h3>
          <p className="text-[11px] text-amber-400 mt-1">${systemState.unpaidInvoices.toLocaleString()} Unpaid Invoices</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Inventory & Stock</span>
            <Boxes className="h-4 w-4 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mt-2">{systemState.finishedGoodsStock} Units</h3>
          <p className="text-[11px] text-slate-500 mt-1">{systemState.rawMaterialsStock} Raw Materials</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Logistics Fleet</span>
            <Truck className="h-4 w-4 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mt-2">{systemState.activeShipments} Shipments</h3>
          <p className="text-[11px] text-emerald-400 mt-1">Real-time dispatch ready</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Production Line</span>
            <Factory className="h-4 w-4 text-orange-400" />
          </div>
          <h3 className="text-xl font-bold text-white mt-2">{systemState.pendingWorkOrders} Work Orders</h3>
          <p className="text-[11px] text-slate-500 mt-1">BOM Auto-Triggered</p>
        </div>
      </div>

      {/* Target Vertical Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
            <ShoppingBag className="h-4 w-4" /> Retail & E-Commerce
          </div>
          <p className="text-xs text-slate-300">
            Syncs storefront sales directly with warehouse inventory and creates client invoices without human intervention.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase">
            <Factory className="h-4 w-4" /> Manufacturing Output
          </div>
          <p className="text-xs text-slate-300">
            Forecasts raw material usage, allocates shop floor work orders, and updates yield logs automatically.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase">
            <Truck className="h-4 w-4" /> Logistics & Distribution
          </div>
          <p className="text-xs text-slate-300">
            Generates carrier tracking manifests, plans fleet movement, and updates delivery schedules in real time.
          </p>
        </div>
      </div>

      {/* Central Event Log Pipeline */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" /> Real-Time Cross-Department Event Stream
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Live Bus Engine: Active</span>
        </div>

        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-xs transition-colors hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-slate-500">{evt.timestamp}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    evt.sourceModule === 'SALES'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : evt.sourceModule === 'INVENTORY'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : evt.sourceModule === 'FINANCE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}
                >
                  {evt.sourceModule}
                </span>
                <span className="font-medium text-slate-200">{evt.action}</span>
              </div>

              <div className="font-mono text-[11px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {JSON.stringify(evt.payload)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
