
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

interface HomePageSettings {
    heroTitle: string;
    heroSubtitle: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<HomePageSettings>({
        heroTitle: '',
        heroSubtitle: '',
    });
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, "settings", "homepage");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data() as HomePageSettings);
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            const docRef = doc(db, "settings", "homepage");
            await setDoc(docRef, settings, { merge: true });
            toast({
                title: "Settings Saved!",
                description: "Your homepage settings have been updated.",
            });
        } catch (error) {
            console.error("Error saving settings: ", error);
            toast({
                title: "Error",
                description: "There was an error saving your settings.",
                variant: "destructive",
            });
        }
    };

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
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
                    placeholder="Unlock Your Potential with Safari Academy" 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Textarea 
                    id="hero-subtitle" 
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})}
                    placeholder="Explore a world of knowledge with our expert-led courses..." 
                    rows={3}
                />
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSave}>Save Homepage Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Manage your e-learning platform's global settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Safari Academy" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <Label>New User Registration</Label>
                    <p className="text-xs text-muted-foreground">Allow new users to sign up.</p>
                </div>
                <Switch defaultChecked/>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">Temporarily disable access to the platform.</p>
                </div>
                <Switch />
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button>Save Platform Settings</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
