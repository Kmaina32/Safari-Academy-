
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
import type { MaintenanceSettings } from '@/lib/types';
import MaintenancePage from '../shared/MaintenancePage';

function MaintenanceProvider({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [settings, setSettings] = useState<MaintenanceSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const settingsDocRef = doc(db, "maintenance", "settings");
        const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data() as MaintenanceSettings);
            } else {
                setSettings({ isEnabled: false, endTime: null, message: '' });
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists() && docSnap.data().role === 'Admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };
        if (!authLoading) {
            checkAdminStatus();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return <AppLoader />;
    }

    if (settings?.isEnabled && !isAdmin) {
        return <MaintenancePage settings={settings} />;
    }

    return <>{children}</>;
}


function LayoutManager({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();
    const pathname = usePathname();
    const noLayoutPages = ['/login', '/signup', '/forgot-password'];
    const hideLayout = noLayoutPages.includes(pathname);

    if (loading) {
        return <AppLoader />;
    }
    
    // The actual App rendering part
    const AppContent = () => {
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

    return (
        <MaintenanceProvider>
            <AppContent />
        </MaintenanceProvider>
    );
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
