
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Quiz, Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, CheckCircle } from 'lucide-react';

export default function StudentQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [courses, setCourses] = useState<Map<string, Course>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzesAndCourses = async () => {
            try {
                const coursesSnapshot = await getDocs(collection(db, "courses"));
                const coursesMap = new Map<string, Course>();
                coursesSnapshot.forEach(doc => {
                    coursesMap.set(doc.id, { id: doc.id, ...doc.data() } as Course);
                });
                setCourses(coursesMap);

                const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
                const quizzesData: Quiz[] = [];
                quizzesSnapshot.forEach((doc) => {
                    quizzesData.push({ id: doc.id, ...doc.data() } as Quiz);
                });
                setQuizzes(quizzesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzesAndCourses();
    }, []);

    if (loading) {
        return <div>Loading quizzes...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">My Assignments & Quizzes</h1>

            {quizzes.length === 0 ? (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">No quizzes available yet.</h3>
                    <p className="text-muted-foreground mt-2">Check back later for assignments and quizzes.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map(quiz => {
                        const course = courses.get(quiz.courseId);
                        return (
                            <Card key={quiz.id}>
                                <CardHeader>
                                    <CardTitle>{quiz.title}</CardTitle>
                                    <CardDescription>
                                        For course: {course?.title || 'Unknown Course'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <FileText className="w-4 h-4 mr-2" />
                                        <span>{quiz.questions.length} Questions</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    {/* For now, buttons are placeholders. In the future, we can build the quiz-taking page. */}
                                    <Button className="w-full" disabled>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Take Quiz
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
