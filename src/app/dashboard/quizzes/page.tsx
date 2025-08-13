
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Quiz, Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function QuizCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-5 w-1/4" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}

export default function StudentQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [courses, setCourses] = useState<Map<string, Course>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesSnapshot = await getDocs(collection(db, "courses"));
            const coursesMap = new Map<string, Course>();
            coursesSnapshot.forEach(doc => {
                coursesMap.set(doc.id, { id: doc.id, ...doc.data() } as Course);
            });
            setCourses(coursesMap);
        };

        fetchCourses().then(() => {
            const quizzesUnsubscribe = onSnapshot(collection(db, "quizzes"), (snapshot) => {
                const quizzesData: Quiz[] = [];
                snapshot.forEach((doc) => {
                    quizzesData.push({ id: doc.id, ...doc.data() } as Quiz);
                });
                setQuizzes(quizzesData);
                setLoading(false);
            }, (error) => {
                 console.error("Error fetching quizzes:", error);
                 setLoading(false);
            });

             return () => quizzesUnsubscribe();
        });

    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-6">My Quizzes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuizCardSkeleton />
                    <QuizCardSkeleton />
                    <QuizCardSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">My Quizzes</h1>

            {quizzes.length === 0 ? (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">No quizzes available yet.</h3>
                    <p className="text-muted-foreground mt-2">Check back later for new quizzes.</p>
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
