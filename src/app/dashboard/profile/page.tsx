
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

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
    const [pageLoading, setPageLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
                } else {
                    // If doc doesn't exist, use auth data and prepare to create doc on save
                    setName(user.displayName || '');
                    setEmail(user.email || '');
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
            await setDoc(userDocRef, { name, email, phone }, { merge: true });

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
                            <AvatarImage src={user.photoURL || `https://placehold.co/100x100`} data-ai-hint="user avatar" alt={name} />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" disabled>Change Avatar (soon)</Button>
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
                        {isSaving ? 'Saving...' : 'Update Profile'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
