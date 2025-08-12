
'use client';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuizForm } from "@/components/admin/QuizForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Quiz } from '@/lib/types';
import Link from 'next/link';

export default function AdminQuizzesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
     const [courses, setCourses] = useState<{id: string, title: string}[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "quizzes"), (snapshot) => {
            const quizzesData: Quiz[] = [];
            snapshot.forEach((doc) => {
                quizzesData.push({ id: doc.id, ...doc.data() } as Quiz);
            });
            setQuizzes(quizzesData);
        });

        const coursesUnsubscribe = onSnapshot(collection(db, 'courses'), (snapshot) => {
            const coursesData: {id: string, title: string}[] = [];
            snapshot.forEach(doc => {
                coursesData.push({id: doc.id, title: doc.data().title});
            });
            setCourses(coursesData);
        });

        return () => {
            unsubscribe();
            coursesUnsubscribe();
        };
    }, []);

    const handleQuizAdded = () => {
        setIsDialogOpen(false);
    }

    const getCourseTitle = (courseId: string) => {
        return courses.find(c => c.id === courseId)?.title || 'Unknown Course';
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Assignments &amp; Quizzes</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Quiz
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Quiz</DialogTitle>
                            <DialogDescription>
                                Fill in the details to create a new quiz or assignment.
                            </DialogDescription>
                        </DialogHeader>
                        <QuizForm onQuizAdded={handleQuizAdded} courses={courses} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quiz Management</CardTitle>
                    <CardDescription>Manage all quizzes and assignments for your courses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Questions</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizzes.map((quiz) => (
                                <TableRow key={quiz.id}>
                                    <TableCell className="font-medium">{quiz.title}</TableCell>
                                    <TableCell>{getCourseTitle(quiz.courseId)}</TableCell>
                                    <TableCell>{quiz.questions.length}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {quizzes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No quizzes found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
