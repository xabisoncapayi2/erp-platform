'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, tenantId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !tenantId)) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, tenantId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-lg font-semibold text-slate-400">Loading Session...</div>
      </div>
    );
  }

  if (!isAuthenticated || !tenantId) {
    return null;
  }

  return <>{children}</>;
};
