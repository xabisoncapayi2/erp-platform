'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Zap,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Activity,
  FileText,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Real-Time Sync Engine', href: '/dashboard/workflow', icon: Zap },
  { name: 'Products & Sales', href: '/dashboard/products', icon: ShoppingBag },
  { name: 'HR & Payroll', href: '/dashboard/hr', icon: Users },
  { name: 'Finance & Invoices', href: '/dashboard/finance', icon: DollarSign },
  { name: 'Inventory & Stock', href: '/dashboard/inventory', icon: Package },
  { name: 'Audit Logs', href: '/dashboard/audit', icon: Activity },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-bold text-white tracking-wider uppercase">ERP Admin</h2>
        <p className="text-xs text-slate-500 mt-0.5">Enterprise Portal</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
