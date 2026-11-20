'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <div className="flex-1 p-6 md:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
