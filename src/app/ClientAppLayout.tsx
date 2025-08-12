
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
            const data = docSnap.data();
            // Ensure maintenanceEndTime is a string and exists, provide a default if not
            const settings: AppSettings = {
                maintenanceMode: data.maintenanceMode || false,
                maintenanceEndTime: data.maintenanceEndTime || new Date(0).toISOString(),
            };
            settingsCache = settings;
            lastFetchTime = now;
            return settingsCache;
        }
        return { maintenanceMode: false, maintenanceEndTime: new Date(0).toISOString() }; // Default if no settings doc
    } catch (error) {
        console.error("Error fetching app settings:", error);
        return { maintenanceMode: false, maintenanceEndTime: new Date(0).toISOString() }; // Fail safe
    }
}

async function isUserAdmin(user: User | null): Promise<boolean> {
    if (!user) return false;
    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists() && userDoc.data().role === 'Admin';
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}


export default function ClientAppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [isAppReady, setIsAppReady] = useState(false);
    const [maintenanceSettings, setMaintenanceSettings] = useState<{ active: boolean; endTime: string }>({
        active: false,
        endTime: new Date().toISOString()
    });

    useEffect(() => {
        const checkAppStatus = async () => {
            if (authLoading) return;

            const adminStatus = await isUserAdmin(user);

            // Admins bypass maintenance mode completely
            if (adminStatus) {
                setIsAppReady(true);
                return;
            }

            // For non-admins, check settings
            const settings = await getAppSettings();
            if (settings && settings.maintenanceMode && new Date(settings.maintenanceEndTime) > new Date()) {
                setMaintenanceSettings({ active: true, endTime: settings.maintenanceEndTime });
                // We don't set isAppReady to true, so maintenance page shows
            } else {
                 // App is not in maintenance, ready to show
                setIsAppReady(true);
            }
        };

        checkAppStatus();
    }, [authLoading, user]);


    // Show loader while checking auth and initial settings
    if (authLoading) {
        return <AppLoader />;
    }

    // After auth check, if app is in maintenance for non-admin, show maintenance page
    if (maintenanceSettings.active) {
        return <MaintenancePage endTime={maintenanceSettings.endTime} />;
    }
    
    // If app is ready, show the layout
    if (isAppReady) {
        return <AppLayout>{children}</AppLayout>;
    }

    // Fallback loader if still processing something
    return <AppLoader />;
}
