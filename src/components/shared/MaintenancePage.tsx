
'use client';

import React, { useState, useEffect } from 'react';
import { Logo } from '@/components/shared/Logo';
import { Wrench } from 'lucide-react';
import type { MaintenanceSettings } from '@/lib/types';

const Countdown = ({ targetDate }: { targetDate: Date }) => {
    const calculateTimeLeft = () => {
        const difference = +targetDate - +new Date();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
        if (value <= 0 && interval !== 'seconds' && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
            return null;
        }

        return (
            <div key={interval} className="text-center">
                <span className="text-4xl md:text-6xl font-bold">{String(value).padStart(2, '0')}</span>
                <span className="block text-sm uppercase text-muted-foreground">{interval}</span>
            </div>
        );
    }).filter(Boolean);

    if (!timerComponents.length) {
        return <p className="text-lg mt-4">We should be back online any moment now.</p>;
    }
    
    return (
        <div className="flex justify-center gap-4 md:gap-8 mt-6">
            {timerComponents}
        </div>
    );
};

export default function MaintenancePage({ settings }: { settings: MaintenanceSettings }) {
    const endTimeDate = settings.endTime ? new Date(settings.endTime.seconds * 1000) : null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="max-w-2xl">
                <div className="mb-8">
                    <Logo />
                </div>
                <Wrench className="h-16 w-16 mx-auto text-primary mb-6" />
                <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4">Under Maintenance</h1>
                <p className="text-muted-foreground text-lg mb-6">
                    {settings.message || "We're currently performing some scheduled maintenance. We'll be back online shortly!"}
                </p>

                {endTimeDate && <Countdown targetDate={endTimeDate} />}
            </div>
        </div>
    );
}
