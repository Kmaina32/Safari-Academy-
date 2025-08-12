
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Assignment, Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, CheckCircle } from 'lucide-react';

export default function StudentAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [courses, setCourses] = useState<Map<string, Course>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignmentsAndCourses = async () => {
            try {
                const coursesSnapshot = await getDocs(collection(db, "courses"));
                const coursesMap = new Map<string, Course>();
                coursesSnapshot.forEach(doc => {
                    coursesMap.set(doc.id, { id: doc.id, ...doc.data() } as Course);
                });
                setCourses(coursesMap);

                const assignmentsSnapshot = await getDocs(collection(db, "assignments"));
                const assignmentsData: Assignment[] = [];
                assignmentsSnapshot.forEach((doc) => {
                    assignmentsData.push({ id: doc.id, ...doc.data() } as Assignment);
                });
                setAssignments(assignmentsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentsAndCourses();
    }, []);

    if (loading) {
        return <div>Loading assignments...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">My Assignments</h1>

            {assignments.length === 0 ? (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">No assignments available yet.</h3>
                    <p className="text-muted-foreground mt-2">Check back later for new assignments.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map(assignment => {
                        const course = courses.get(assignment.courseId);
                        return (
                            <Card key={assignment.id}>
                                <CardHeader>
                                    <CardTitle>{assignment.title}</CardTitle>
                                    <CardDescription>
                                        For course: {course?.title || 'Unknown Course'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <FileText className="w-4 h-4 mr-2" />
                                        <span>{assignment.questions.length} Questions</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    {/* For now, buttons are placeholders. In the future, we can build the assignment-taking page. */}
                                    <Button className="w-full" disabled>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Take Assignment
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
