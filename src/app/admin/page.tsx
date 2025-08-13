
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from 'date-fns';
import type { Course } from '@/lib/types';

interface ActivityItem {
    id: string;
    type: 'new_user' | 'new_discussion';
    timestamp: Date;
    data: any;
}

export default function AdminDashboardPage() {
    const [userCount, setUserCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const usersUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            setUserCount(snapshot.size);
            const userActivities = snapshot.docs.map(doc => ({
                id: doc.id,
                type: 'new_user' as const,
                timestamp: (doc.data().createdAt as any).toDate(),
                data: doc.data()
            }));
            setRecentActivity(prev => {
                const otherActivities = prev.filter(item => item.type !== 'new_user');
                const combined = [...userActivities, ...otherActivities];
                return combined.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            });
        }, (err) => {
            console.error("Error fetching users:", err);
            setLoading(false);
        });

        const coursesUnsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
            let revenue = 0;
            snapshot.forEach(doc => {
                const course = doc.data() as Course;
                revenue += course.price || 0;
            });
            setCourseCount(snapshot.size);
            setTotalRevenue(revenue);
        }, (err) => {
            console.error("Error fetching courses:", err);
            setLoading(false);
        });

        const discussionsUnsubscribe = onSnapshot(query(collection(db, "discussions"), orderBy("createdAt", "desc"), limit(3)), (snapshot) => {
             const discussionActivities = snapshot.docs.map(doc => ({
                id: doc.id,
                type: 'new_discussion' as const,
                timestamp: (doc.data().createdAt as any).toDate(),
                data: doc.data()
            }));
             setRecentActivity(prev => {
                const otherActivities = prev.filter(item => item.type !== 'new_discussion');
                const combined = [...discussionActivities, ...otherActivities];
                return combined.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            });
        }, (err) => {
            console.error("Error fetching discussions:", err);
        });

        // Combine loading state
        const allLoaded = [usersUnsubscribe, coursesUnsubscribe, discussionsUnsubscribe];
        Promise.all(allLoaded).then(() => setLoading(false));

        return () => {
            usersUnsubscribe();
            coursesUnsubscribe();
            discussionsUnsubscribe();
        };
    }, []);
    
    const renderActivity = (item: ActivityItem) => {
        const time = formatDistanceToNow(item.timestamp, { addSuffix: true });
        
        switch (item.type) {
            case 'new_user':
                return (
                     <li key={item.id} className="flex items-center gap-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={item.data.avatarUrl} />
                            <AvatarFallback><UserPlus className="h-4 w-4"/></AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm"><span className="font-medium">{item.data.name}</span> just signed up.</p>
                            <p className="text-xs text-muted-foreground">{time}</p>
                        </div>
                    </li>
                );
            case 'new_discussion':
                 return (
                     <li key={item.id} className="flex items-center gap-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={item.data.avatar} />
                             <AvatarFallback>{item.data.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm">
                                <span className="font-medium">{item.data.user}</span> started a new discussion in <span className="font-medium">{item.data.course}</span>.
                            </p>
                            <p className="text-xs text-muted-foreground">{time}</p>
                        </div>
                    </li>
                );
            default:
                return null;
        }
    }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userCount}</div>
                    <p className="text-xs text-muted-foreground">Total registered users</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{courseCount}</div>
                    <p className="text-xs text-muted-foreground">Total published courses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                     <p className="text-xs text-muted-foreground">From all course sales</p>
                </CardContent>
            </Card>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of recent platform activities.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading activities...</p>
                ) : recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent activity.</p>
                ) : (
                    <ul className="space-y-4">
                        {recentActivity.slice(0, 5).map(renderActivity)}
                    </ul>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
