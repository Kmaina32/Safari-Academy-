
'use client';

import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

export default function LoginPage() {
  const [bgImage, setBgImage] = useState("https://placehold.co/1920x1080");

   useEffect(() => {
    const fetchSettings = async () => {
        try {
            const docRef = doc(db, "settings", "homepage");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().authBackgroundImageUrl) {
                setBgImage(docSnap.data().authBackgroundImageUrl);
            }
        } catch (error) {
            console.error("Error fetching auth background image:", error);
        }
    };
    fetchSettings();
  }, []);

  return (
    <div 
      className="flex h-screen w-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <Card className="w-full max-w-sm z-10">
        <CardHeader>
            <div className="flex flex-col space-y-2 text-center">
                <Logo />
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email to sign in to your account
                </p>
            </div>
        </CardHeader>
        <CardContent>
            <LoginForm />
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            <Link
                href="/signup"
                className="hover:text-brand underline underline-offset-4"
            >
                Don't have an account? Sign Up
            </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
