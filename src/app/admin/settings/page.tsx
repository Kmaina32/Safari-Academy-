
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import type { AppSettings } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { clearSettingsCache } from '@/app/ClientAppLayout';


interface HomePageSettings {
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
    authBackgroundImageUrl: string;
}

export default function AdminSettingsPage() {
    const [homepageSettings, setHomepageSettings] = useState<HomePageSettings>({
        heroTitle: '',
        heroSubtitle: '',
        heroImageUrl: '',
        authBackgroundImageUrl: '',
    });
    const [appSettings, setAppSettings] = useState<AppSettings>({
        maintenanceMode: false,
        maintenanceEndTime: new Date().toISOString(),
    })
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const homepageDocRef = doc(db, "settings", "homepage");
                const homepageDocSnap = await getDoc(homepageDocRef);
                if (homepageDocSnap.exists()) {
                    setHomepageSettings(homepageDocSnap.data() as HomePageSettings);
                }

                const appDocRef = doc(db, "settings", "app");
                const appDocSnap = await getDoc(appDocRef);
                if(appDocSnap.exists()) {
                    setAppSettings(appDocSnap.data() as AppSettings);
                } else {
                    // Set default to off if no settings document exists
                    setAppSettings({
                        maintenanceMode: false,
                        maintenanceEndTime: new Date().toISOString(),
                    })
                }

            } catch (error) {
                console.error("Error fetching settings:", error);
                 toast({
                    title: "Error",
                    description: "Could not fetch settings.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    const handleSaveHomepage = async () => {
        try {
            const docRef = doc(db, "settings", "homepage");
            await setDoc(docRef, homepageSettings, { merge: true });
            toast({
                title: "Homepage Settings Saved!",
                description: "Your homepage settings have been updated.",
            });
        } catch (error) {
            console.error("Error saving settings: ", error);
            toast({
                title: "Error",
                description: "There was an error saving your homepage settings.",
                variant: "destructive",
            });
        }
    };

    const handleSavePlatform = async () => {
         try {
            const docRef = doc(db, "settings", "app");
            await setDoc(docRef, appSettings, { merge: true });
            clearSettingsCache(); // Invalidate the cache
            toast({
                title: "Platform Settings Saved!",
                description: "Your platform settings have been updated and will take effect immediately.",
            });
        } catch (error) {
            console.error("Error saving settings: ", error);
            toast({
                title: "Error",
                description: "There was an error saving your platform settings.",
                variant: "destructive",
            });
        }
    }


    if (loading) {
        return <div>Loading settings...</div>;
    }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      
      <Card>
        <CardHeader>
            <CardTitle>Homepage Content</CardTitle>
            <CardDescription>Control the content displayed on the homepage hero section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="hero-title">Hero Title</Label>
                <Input 
                    id="hero-title" 
                    value={homepageSettings.heroTitle}
                    onChange={(e) => setHomepageSettings({...homepageSettings, heroTitle: e.target.value})}
                    placeholder="Unlock Your Potential with Safari Academy" 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Textarea 
                    id="hero-subtitle" 
                    value={homepageSettings.heroSubtitle}
                    onChange={(e) => setHomepageSettings({...homepageSettings, heroSubtitle: e.target.value})}
                    placeholder="Explore a world of knowledge with our expert-led courses..." 
                    rows={3}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="hero-image-url">Hero Image URL</Label>
                <Input 
                    id="hero-image-url" 
                    value={homepageSettings.heroImageUrl}
                    onChange={(e) => setHomepageSettings({...homepageSettings, heroImageUrl: e.target.value})}
                    placeholder="https://example.com/hero-image.jpg"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="auth-bg-url">Auth Pages Background URL</Label>
                <Input 
                    id="auth-bg-url" 
                    value={homepageSettings.authBackgroundImageUrl}
                    onChange={(e) => setHomepageSettings({...homepageSettings, authBackgroundImageUrl: e.target.value})}
                    placeholder="https://example.com/auth-background.jpg"
                />
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveHomepage}>Save Homepage Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Manage your e-learning platform's global settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">Temporarily disable access to the platform for non-admins.</p>
                </div>
                <Switch 
                    checked={appSettings.maintenanceMode}
                    onCheckedChange={(checked) => setAppSettings(prev => ({...prev, maintenanceMode: checked}))}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="maintenance-end-time">Maintenance End Time</Label>
                <Input 
                    id="maintenance-end-time" 
                    type="datetime-local"
                    value={appSettings.maintenanceEndTime.substring(0,16)}
                    onChange={(e) => setAppSettings(prev => ({...prev, maintenanceEndTime: new Date(e.target.value).toISOString()}))}
                    disabled={!appSettings.maintenanceMode}
                />
                <p className="text-xs text-muted-foreground">Set the time when maintenance mode will automatically turn off.</p>
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSavePlatform}>Save Platform Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
