
'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AppLoader } from '@/components/shared/AppLoader';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <AppLoader />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <AdminHeader />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
