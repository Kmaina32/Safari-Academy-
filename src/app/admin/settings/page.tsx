
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { generateCourse } from '@/ai/flows/course-generator';
import { Loader2 } from 'lucide-react';


interface HomePageSettings {
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
    authBackgroundImageUrl: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<HomePageSettings>({
        heroTitle: '',
        heroSubtitle: '',
        heroImageUrl: '',
        authBackgroundImageUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [courseTopic, setCourseTopic] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "settings", "homepage");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as HomePageSettings);
                } else {
                    // Initialize with default values if no settings exist
                    setSettings({
                        heroTitle: "Unlock Your Potential with Safari Academy",
                        heroSubtitle: "Explore a world of knowledge with our expert-led courses...",
                        heroImageUrl: "https://placehold.co/1200x600",
                        authBackgroundImageUrl: "https://placehold.co/1920x1080",
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                 toast({
                    title: "Error",
                    description: "Could not fetch homepage settings.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

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
    
    const handleGenerateCourse = async () => {
        if (!courseTopic) {
            toast({
                title: "Topic Required",
                description: "Please enter a topic for the course.",
                variant: "destructive",
            });
            return;
        }
        setGenerating(true);
        try {
            const generatedData = await generateCourse({ topic: courseTopic });
            const allLessons = generatedData.modules.flatMap((m, moduleIndex) => m.lessons.map((l, lessonIndex) => ({
                ...l,
                id: `m${moduleIndex+1}-l${lessonIndex+1}`,
            })));

            await addDoc(collection(db, "courses"), {
                ...generatedData,
                imageUrl: `https://placehold.co/600x400?text=${generatedData.title.replace(/\s/g, '+')}`,
                rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
                enrolledStudents: Math.floor(Math.random() * 1000),
                price: Math.floor(Math.random() * 8) * 10 + 29.99, // Random price
                lessons: allLessons,
                modules: generatedData.modules.map((m, moduleIndex) => ({
                    ...m,
                    imageUrl: "https://placehold.co/600x400",
                    lessons: m.lessons.map((l, lessonIndex) => ({
                        ...l,
                        id: `m${moduleIndex+1}-l${lessonIndex+1}`,
                    }))
                })),
            });

            toast({
                title: "Course Generated!",
                description: `Successfully created the course: "${generatedData.title}"`,
            });
            setCourseTopic('');
        } catch (error) {
             console.error("Error generating course: ", error);
             toast({
                title: "Error",
                description: "There was an error generating the course.",
                variant: "destructive",
            });
        } finally {
            setGenerating(false);
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
             <div className="space-y-2">
                <Label htmlFor="hero-image-url">Hero Image URL</Label>
                <Input 
                    id="hero-image-url" 
                    value={settings.heroImageUrl}
                    onChange={(e) => setSettings({...settings, heroImageUrl: e.target.value})}
                    placeholder="https://example.com/hero-image.jpg"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="auth-bg-url">Auth Pages Background URL</Label>
                <Input 
                    id="auth-bg-url" 
                    value={settings.authBackgroundImageUrl}
                    onChange={(e) => setSettings({...settings, authBackgroundImageUrl: e.target.value})}
                    placeholder="https://example.com/auth-background.jpg"
                />
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSave}>Save Homepage Settings</Button>
        </CardFooter>
      </Card>

        <Card>
            <CardHeader>
                <CardTitle>Database Management</CardTitle>
                <CardDescription>Use AI to generate comprehensive course content for a given topic.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="course-topic">Course Topic</Label>
                        <Input 
                            id="course-topic" 
                            placeholder="e.g., 'Introduction to Quantum Physics'"
                            value={courseTopic}
                            onChange={(e) => setCourseTopic(e.target.value)}
                            disabled={generating}
                        />
                    </div>
                   <Button variant="secondary" onClick={handleGenerateCourse} disabled={generating}>
                        {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {generating ? 'Generating...' : 'Generate Course'}
                   </Button>
                </div>
            </CardContent>
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
