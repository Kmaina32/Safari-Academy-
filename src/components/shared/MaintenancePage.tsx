
'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from "@/components/shared/Logo";
import { HardHat } from 'lucide-react';

interface MaintenancePageProps {
    endTime: string;
}

export function MaintenancePage({ endTime }: MaintenancePageProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });
    
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(endTime);
            const difference = end.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                // Optional: redirect or reload when timer hits zero
                // window.location.reload();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="text-center p-8">
                <div className="animate-pulse mb-8">
                    <Logo />
                </div>
                <HardHat className="h-16 w-16 mx-auto text-accent mb-4" />
                <h1 className="text-3xl font-bold font-headline mb-2">Under Maintenance</h1>
                <p className="text-muted-foreground mb-6">We are currently performing scheduled maintenance. We should be back online shortly.</p>
                <div className="flex justify-center space-x-4 text-2xl font-mono">
                    <div>
                        <span className="font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                        <span className="text-xs block">Days</span>
                    </div>
                    <div>
                        <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-xs block">Hours</span>
                    </div>
                    <div>
                        <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-xs block">Minutes</span>
                    </div>
                    <div>
                        <span className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-xs block">Seconds</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
