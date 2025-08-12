
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth, storage } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function ProfileSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-10 w-28" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    );
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [pageLoading, setPageLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            const fetchUserData = async () => {
                setPageLoading(true);
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data() as User;
                    setName(userData.name || user.displayName || '');
                    setEmail(userData.email || user.email || '');
                    setPhone(userData.phone || '');
                    setAvatarUrl(userData.avatarUrl || user.photoURL || '');
                } else {
                    // If doc doesn't exist, use auth data and prepare to create doc on save
                    setName(user.displayName || '');
                    setEmail(user.email || '');
                    setAvatarUrl(user.photoURL || '');
                }
                setPageLoading(false);
            };
            fetchUserData();
        }
    }, [user, authLoading, router]);

    const handleUpdateProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            // Update Firebase Auth profile
            if (auth.currentUser && auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, { displayName: name });
            }

            // Update or create Firestore user document
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { name, email, phone, avatarUrl }, { merge: true });

            toast({
                title: 'Profile Updated',
                description: 'Your information has been successfully updated.',
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: 'Failed to update profile. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user) {
            return;
        }
        const file = e.target.files[0];
        setIsUploading(true);

        try {
            const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Update state and Firebase
            setAvatarUrl(downloadURL);
            await updateProfile(auth.currentUser!, { photoURL: downloadURL });
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { avatarUrl: downloadURL }, { merge: true });
            
            toast({
                title: 'Avatar Updated!',
                description: 'Your new avatar has been saved.',
            });
        } catch (error) {
             console.error('Error uploading avatar:', error);
             toast({
                title: 'Upload Error',
                description: 'Failed to upload new avatar.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (authLoading || pageLoading || !user) {
        return (
             <div>
                <h1 className="text-3xl font-bold font-headline mb-6">Profile</h1>
                <ProfileSkeleton />
             </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarUrl || `https://placehold.co/100x100`} data-ai-hint="user avatar" alt={name} />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            hidden 
                            accept="image/png, image/jpeg"
                            onChange={handleAvatarChange}
                        />
                        <Button 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isUploading ? "Uploading..." : "Change Avatar"}
                        </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" value={email} type="email" disabled />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button onClick={handleUpdateProfile} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSaving ? 'Saving...' : 'Update Profile'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
