
'use client';

import { SignupForm } from "@/components/auth/SignupForm";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

export default function SignupPage() {
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
        className="flex min-h-screen w-screen items-center justify-center bg-cover bg-center py-8"
        style={{ backgroundImage: `url(${bgImage})` }}
    >
        <div className="absolute inset-0 bg-black/60" />
      <Card className="w-full max-w-md z-10">
        <CardHeader>
            <div className="flex flex-col space-y-2 text-center">
                <Logo />
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details below to create your account
                </p>
            </div>
        </CardHeader>
        <CardContent>
            <SignupForm />
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
            >
                Privacy Policy
            </Link>
            .
            </p>
            <p className="mt-2 px-8 text-center text-sm text-muted-foreground">
            <Link
                href="/login"
                className="hover:text-brand underline underline-offset-4"
            >
                Already have an account? Login
            </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
