
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AppLoader } from '../shared/AppLoader';
import { ThemeProvider } from "next-themes";

function LayoutManager({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();
    const pathname = usePathname();
    const noLayoutPages = ['/login', '/signup', '/forgot-password'];
    const isAdminPage = pathname.startsWith('/admin');
    const hideLayout = noLayoutPages.includes(pathname) || isAdminPage;

    if (loading) {
        return <AppLoader />;
    }
    
    if (hideLayout) {
        return (
            <>
                <main>{children}</main>
                <Toaster />
            </>
        )
    }

    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-16">{children}</main>
            <Footer />
            <Toaster />
        </div>
    )
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
     <AuthProvider>
       <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutManager>{children}</LayoutManager>
        </ThemeProvider>
    </AuthProvider>
  )
}
