'use client';

import { useAuth } from '../context/auth-context';
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
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold text-gray-400">Loading Session...</div>
      </div>
    );
  }

  if (!isAuthenticated || !tenantId) {
    return null;
  }

  return <>{children}</>;
};