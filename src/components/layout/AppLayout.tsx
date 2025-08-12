
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const noLayoutPages = ['/login', '/signup', '/forgot-password'];
  const hideFooter = noLayoutPages.includes(pathname);
  const hideHeader = noLayoutPages.includes(pathname);
  
  if (noLayoutPages.includes(pathname)) {
    return (
       <AuthProvider>
        <main>{children}</main>
        <Toaster />
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
        <div className="relative flex min-h-screen flex-col">
            {!hideHeader && <Header />}
            <main className="flex-1 pb-16">{children}</main>
            {!hideFooter && <Footer />}
            <Toaster />
        </div>
    </AuthProvider>
  );
}

