'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import {
  Users,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, tenantId } = useAuth();

  const metrics = [
    {
      title: 'Active Employees',
      value: '142',
      change: '+4 this month',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Monthly Payroll Run',
      value: '$128,450',
      change: 'Scheduled in 3 days',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Low Stock Items',
      value: '18',
      change: '2 items critical',
      icon: Package,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'System Health',
      value: '99.98%',
      change: 'Tenant DB healthy',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.email ? user.email.split('@')[0] : 'User'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Overview for organization workspace{' '}
            <span className="text-blue-400 font-semibold">{tenantId}</span>
          </p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            System Healthy
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{metric.title}</span>
                <div className={`rounded-lg p-2 ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-white">{metric.value}</h2>
                <p className="mt-1 text-xs text-slate-500">{metric.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white">Recent Multi-Tenant Events</h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Live Log
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                action: 'Payroll Calculated',
                detail: 'Processed draft payroll batch for 142 employees',
                time: '12m ago',
                status: 'completed',
              },
              {
                action: 'New Employee Onboarded',
                detail: 'Added Sarah Jenkins (Engineering Dept)',
                time: '2h ago',
                status: 'completed',
              },
              {
                action: 'Inventory Stock Threshold',
                detail: 'Item #INV-8821 reached low level reorder limit',
                time: '4h ago',
                status: 'warning',
              },
            ].map((event, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between rounded-lg border border-slate-800/80 bg-slate-950/50 p-4"
              >
                <div className="flex items-start gap-3">
                  {event.status === 'warning' ? (
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{event.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{event.detail}</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0">{event.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Run Payroll Process', href: '/dashboard/hr' },
              { label: 'Add Employee Profile', href: '/dashboard/hr' },
              { label: 'View Inventory Audit', href: '/dashboard/inventory' },
              { label: 'Security & Access Control', href: '/dashboard/settings' },
            ].map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-all group"
              >
                <span>{action.label}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
