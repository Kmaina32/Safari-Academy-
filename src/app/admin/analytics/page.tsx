'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, DollarSign } from "lucide-react";
import { LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, PieChart, Pie, Cell } from "recharts";
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from "@/lib/types";

const monthlyRevenueMock = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];

const courseEnrollments = [
  { name: 'Web Dev', value: 400 },
  { name: 'Design', value: 300 },
  { name: 'Marketing', value: 300 },
  { name: 'Speaking', value: 200 },
];

const COLORS = ['#31AD48', '#D4A944', '#4A90E2', '#8B5CF6'];


export default function AdminAnalyticsPage() {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const usersUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      setUserCount(snapshot.size);
    });
    
    const coursesUnsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
        let revenue = 0;
        const coursesData: Course[] = [];
        snapshot.forEach((doc) => {
            const course = doc.data() as Course;
            coursesData.push(course);
            revenue += course.price || 0;
        });
        setCourseCount(coursesData.length);
        setTotalRevenue(revenue);
    });

    return () => {
      usersUnsubscribe();
      coursesUnsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Analytics Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Enrollments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
                <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{courseCount}</div>
                <p className="text-xs text-muted-foreground">Total courses on platform</p>
            </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Last 6 months revenue data (mock data).</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueMock}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Enrollments by Category</CardTitle>
                <CardDescription>Student distribution across course categories (mock data).</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={courseEnrollments} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                             {courseEnrollments.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
