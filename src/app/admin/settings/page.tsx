
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
import { Loader2 } from 'lucide-react';
import type { CertificateSettings } from '@/lib/types';


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
    const [certificateSettings, setCertificateSettings] = useState<CertificateSettings>({
        signatureUrl: '',
        sealUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [savingHomepage, setSavingHomepage] = useState(false);
    const [savingCerts, setSavingCerts] = useState(false);
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

                const certDocRef = doc(db, "settings", "certificate");
                const certDocSnap = await getDoc(certDocRef);
                if (certDocSnap.exists()) {
                    setCertificateSettings(certDocSnap.data() as CertificateSettings);
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
        setSavingHomepage(true);
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
        } finally {
            setSavingHomepage(false);
        }
    };
    
    const handleSaveCerts = async () => {
        setSavingCerts(true);
        try {
            const docRef = doc(db, "settings", "certificate");
            await setDoc(docRef, certificateSettings, { merge: true });
            toast({
                title: "Certificate Settings Saved!",
                description: "Your certificate settings have been updated.",
            });
        } catch (error) {
            console.error("Error saving settings: ", error);
            toast({
                title: "Error",
                description: "There was an error saving your certificate settings.",
                variant: "destructive",
            });
        } finally {
            setSavingCerts(false);
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
            <Button onClick={handleSaveHomepage} disabled={savingHomepage}>
                {savingHomepage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Homepage Settings
            </Button>
        </CardFooter>
      </Card>

       <Card>
        <CardHeader>
            <CardTitle>Certificate Settings</CardTitle>
            <CardDescription>Manage the signature and seal displayed on generated certificates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="signature-url">Signature Image URL</Label>
                <Input 
                    id="signature-url" 
                    value={certificateSettings.signatureUrl}
                    onChange={(e) => setCertificateSettings({...certificateSettings, signatureUrl: e.target.value})}
                    placeholder="https://example.com/signature.png" 
                />
                 <p className="text-xs text-muted-foreground">Recommended: A PNG with a transparent background.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="seal-url">Seal/Logo Image URL</Label>
                <Input 
                    id="seal-url" 
                    value={certificateSettings.sealUrl}
                    onChange={(e) => setCertificateSettings({...certificateSettings, sealUrl: e.target.value})}
                    placeholder="https://example.com/seal.png" 
                />
                 <p className="text-xs text-muted-foreground">Recommended: A circular PNG with a transparent background.</p>
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveCerts} disabled={savingCerts}>
                 {savingCerts && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Certificate Settings
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
