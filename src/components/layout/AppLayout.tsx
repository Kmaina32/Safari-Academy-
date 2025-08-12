
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const noFooterPages = ['/login', '/signup', '/forgot-password'];
  const hideFooter = isAdminPage || noFooterPages.includes(pathname);

  return (
    <AuthProvider>
        <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            {!hideFooter && <Footer />}
            <Toaster />
        </div>
    </AuthProvider>
  );
}
