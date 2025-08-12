
'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { MaintenancePage } from '@/components/shared/MaintenancePage';
import { AppLoader } from '@/components/shared/AppLoader';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AppSettings } from '@/lib/types';
import type { User } from 'firebase/auth';

// A simple in-memory cache to avoid re-fetching settings on every navigation
let settingsCache: AppSettings | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function clearSettingsCache() {
    settingsCache = null;
    lastFetchTime = 0;
}

async function getAppSettings(forceRefresh = false): Promise<AppSettings | null> {
    const now = Date.now();
    if (!forceRefresh && settingsCache && (now - lastFetchTime < CACHE_DURATION)) {
        return settingsCache;
    }

    try {
        const docRef = doc(db, "settings", "app");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            settingsCache = docSnap.data() as AppSettings;
            lastFetchTime = now;
            return settingsCache;
        }
        return null;
    } catch (error) {
        console.error("Error fetching app settings:", error);
        return null; // Fail safe, don't block the app
    }
}

async function isUserAdmin(user: User | null): Promise<boolean> {
    if (!user) return false;
    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists() && userDoc.data().role === 'Admin';
    } catch {
        return false;
    }
}


export default function ClientAppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [maintenanceSettings, setMaintenanceSettings] = useState<{ active: boolean; endTime: string, checked: boolean, isAdmin: boolean }>({
        active: false,
        endTime: new Date().toISOString(),
        checked: false,
        isAdmin: false
    });

    useEffect(() => {
        const checkMaintenanceMode = async () => {
            const adminStatus = await isUserAdmin(user);
            
            // If the user is an admin, we don't need to check maintenance settings.
            // We can just let them through immediately.
            if (adminStatus) {
                 setMaintenanceSettings({ active: false, endTime: '', checked: true, isAdmin: true });
                 return;
            }

            const settings = await getAppSettings();

            if (settings) {
                const isMaintenanceActive = settings.maintenanceMode && new Date(settings.maintenanceEndTime) > new Date();
                setMaintenanceSettings({
                    active: isMaintenanceActive,
                    endTime: settings.maintenanceEndTime,
                    checked: true,
                    isAdmin: adminStatus
                });
            } else {
                 setMaintenanceSettings({ active: false, endTime: '', checked: true, isAdmin: adminStatus });
            }
        };

        if (!authLoading) {
            checkMaintenanceMode();
        }
    }, [authLoading, user]);

    if (authLoading || !maintenanceSettings.checked) {
        return <AppLoader />;
    }

    if (maintenanceSettings.active && !maintenanceSettings.isAdmin) {
        return <MaintenancePage endTime={maintenanceSettings.endTime} />;
    }
    
    return <AppLayout>{children}</AppLayout>;
}
