'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

interface Discussion {
    id: string;
    user: string;
    course: string;
    comment: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    avatar?: string;
}

export default function AdminDiscussionsPage() {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);

    useEffect(() => {
        const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const discussionsData: Discussion[] = [];
            querySnapshot.forEach((doc) => {
                discussionsData.push({ id: doc.id, ...doc.data() } as Discussion);
            });
            setDiscussions(discussionsData);
        });

        return () => unsubscribe();
    }, []);

    const formatTimestamp = (timestamp: { seconds: number, nanoseconds: number }) => {
        if (!timestamp) return 'Just now';
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        return formatDistanceToNow(date, { addSuffix: true });
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussions</CardTitle>
        <CardDescription>Moderate and manage user discussions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            {discussions.length === 0 && (
                <p className="text-muted-foreground text-center">No discussions yet.</p>
            )}
            {discussions.map(d => (
                <div key={d.id} className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={d.avatar} />
                        <AvatarFallback>{d.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">{d.user} <span className="font-normal text-muted-foreground">on {d.course}</span></p>
                            <p className="text-xs text-muted-foreground">{formatTimestamp(d.createdAt)}</p>
                        </div>
                        <p className="text-sm mt-1">{d.comment}</p>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
