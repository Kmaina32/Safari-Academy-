
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wrench } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from '@/lib/utils';
import type { MaintenanceSettings } from '@/lib/types';


export default function AdminMaintenancePage() {
    const [settings, setSettings] = useState<MaintenanceSettings>({
        isEnabled: false,
        endTime: null,
        message: 'The platform is currently down for scheduled maintenance. We should be back online shortly. Thank you for your patience!',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [date, setDate] = React.useState<Date | undefined>();
    const [time, setTime] = useState('00:00');
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "maintenance", "settings");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as MaintenanceSettings;
                    setSettings(data);
                    if (data.endTime) {
                        const endDate = new Date(data.endTime.seconds * 1000);
                        setDate(endDate);
                        setTime(format(endDate, 'HH:mm'));
                    }
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                 toast({
                    title: "Error",
                    description: "Could not fetch maintenance settings.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, "maintenance", "settings");
            let finalEndTime: Timestamp | null = null;
            if (date) {
                const [hours, minutes] = time.split(':').map(Number);
                const combinedDate = new Date(date);
                combinedDate.setHours(hours, minutes);
                finalEndTime = Timestamp.fromDate(combinedDate);
            }
            
            await setDoc(docRef, { ...settings, endTime: finalEndTime }, { merge: true });
            toast({
                title: "Settings Saved!",
                description: "Maintenance mode settings have been updated.",
            });
        } catch (error) {
            console.error("Error saving settings: ", error);
            toast({
                title: "Error",
                description: "There was an error saving your settings.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading settings...</div>;
    }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Wrench className="h-8 w-8 text-primary" />
        <div>
            <h1 className="text-3xl font-bold font-headline">Maintenance Mode</h1>
            <p className="text-muted-foreground">Enable or disable site-wide maintenance mode for non-admin users.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Maintenance Controls</CardTitle>
            <CardDescription>Use this section to take the site offline for updates or other maintenance tasks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                    <Label htmlFor="maintenance-mode" className="text-base font-semibold">
                        Enable Maintenance Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        When enabled, all non-admin users will be shown the maintenance page.
                    </p>
                </div>
                <Switch
                    id="maintenance-mode"
                    checked={settings.isEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, isEnabled: checked })}
                    aria-label="Toggle maintenance mode"
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                <Textarea 
                    id="maintenance-message" 
                    value={settings.message}
                    onChange={(e) => setSettings({...settings, message: e.target.value})}
                    placeholder="We'll be back soon..." 
                    rows={4}
                    disabled={!settings.isEnabled}
                />
            </div>
            <div className="space-y-2">
                <Label>Maintenance End Time (Optional)</Label>
                <p className="text-sm text-muted-foreground">Set a date and time for when the maintenance will end to show a countdown timer.</p>
                <div className="flex items-center gap-2">
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                            disabled={!settings.isEnabled}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-[120px]"
                        disabled={!settings.isEnabled || !date}
                    />
                </div>
            </div>
        </CardContent>
         <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
