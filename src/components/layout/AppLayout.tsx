
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AppLoader } from '../shared/AppLoader';
import { ThemeProvider } from "next-themes";
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MaintenanceSettings, User } from '@/lib/types';
import MaintenancePage from '../shared/MaintenancePage';

function LayoutManager({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const pathname = usePathname();
    const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User | null>(null);
    
    useEffect(() => {
        const settingsUnsubscribe = onSnapshot(doc(db, "maintenance", "settings"), (doc) => {
            setMaintenanceSettings(doc.data() as MaintenanceSettings);
            setLoading(false);
        }, () => setLoading(false));

        return () => settingsUnsubscribe();
    }, []);

    useEffect(() => {
        if(user) {
            const userUnsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
                setUserData(doc.data() as User);
            });
            return () => userUnsubscribe();
        } else {
            setUserData(null);
        }
    }, [user]);

    const noLayoutPages = ['/login', '/signup', '/forgot-password'];
    const isAdminPage = pathname.startsWith('/admin');
    const hideLayout = noLayoutPages.includes(pathname) || isAdminPage;

    if (authLoading || loading) {
        return <AppLoader />;
    }

    const isMaintenanceMode = maintenanceSettings?.isEnabled && userData?.role !== 'Admin';

    if (isMaintenanceMode) {
        return <MaintenancePage settings={maintenanceSettings!} />;
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
