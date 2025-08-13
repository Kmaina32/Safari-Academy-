
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerateCertificateForm } from '@/components/admin/GenerateCertificateForm';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User, Course } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import { Award, BookCheck, History } from 'lucide-react';

function GradingSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex space-x-4 border-b">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-32 mt-4" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminGradingPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCertDialogOpen, setIsCertDialogOpen] = useState(false); // Re-use state for simplicity

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setUsers(usersData);

                const coursesSnapshot = await getDocs(collection(db, "courses"));
                const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
                setCourses(coursesData);
            } catch (error) {
                console.error("Error fetching data for grading page:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCertificateGenerated = () => {
        // You could add logic here to refresh data or close a dialog if needed
    };

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-6">Grading Center</h1>
                <GradingSkeleton />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Grading Center</h1>
            <Tabs defaultValue="certificates" className="w-full">
                <TabsList>
                    <TabsTrigger value="submissions">
                        <BookCheck className="mr-2 h-4 w-4" />
                        Submissions
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <History className="mr-2 h-4 w-4" />
                        Student History
                    </TabsTrigger>
                    <TabsTrigger value="certificates">
                        <Award className="mr-2 h-4 w-4" />
                        Certificates
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="submissions" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment Submissions</CardTitle>
                            <CardDescription>Review and grade submitted assignments from students.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-muted-foreground py-12">
                                <p>Assignment submission feature coming soon.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student History</CardTitle>
                            <CardDescription>View detailed progress and grades for each student by course.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-muted-foreground py-12">
                                <p>Student grade history feature coming soon.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="certificates" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Issue Certificate</CardTitle>
                            <CardDescription>
                                Manually generate a certificate of completion for a student.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-md">
                                <GenerateCertificateForm 
                                    users={users} 
                                    courses={courses} 
                                    onCertificateGenerated={handleCertificateGenerated}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
