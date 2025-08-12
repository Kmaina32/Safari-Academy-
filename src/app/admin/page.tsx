
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, BarChart, Activity, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

const recentActivity = [
    { user: 'Jane Smith', activity: 'Enrolled in Advanced Graphic Design', time: '2h ago' },
    { user: 'Alex Doe', activity: 'Completed Intro to Web Development', time: '5h ago' },
    { user: 'Admin User', activity: 'Published a new course: The Art of Public Speaking', time: '1d ago' },
];

export default function AdminDashboardPage() {
    const [userCount, setUserCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);

    useEffect(() => {
        const usersUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            setUserCount(snapshot.size);
        });
        const coursesUnsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
            setCourseCount(snapshot.size);
        });

        return () => {
            usersUnsubscribe();
            coursesUnsubscribe();
        };
    }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userCount}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{courseCount}</div>
                    <p className="text-xs text-muted-foreground">+5 New</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$12,345</div>
                     <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">-2% from last month</p>
                </CardContent>
            </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of recent platform activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {recentActivity.map(item => (
                        <li key={item.activity} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9">
                                <AvatarImage />
                                <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm"><span className="font-medium">{item.user}</span> {item.activity}.</p>
                                <p className="text-xs text-muted-foreground">{item.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                 <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="font-medium">Active Students Today</span>
                    </div>
                    <span className="font-bold text-lg">342</span>
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span className="font-medium">New Discussions</span>
                    </div>
                    <span className="font-bold text-lg">12</span>
                 </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
