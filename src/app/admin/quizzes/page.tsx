
'use client';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Quiz } from '@/lib/types';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function AdminQuizzesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [courses, setCourses] = useState<{id: string, title: string}[]>([]);
    const { toast } = useToast();

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

    const handleDeleteQuiz = async (quizId: string) => {
        try {
            await deleteDoc(doc(db, "quizzes", quizId));
            toast({
                title: "Quiz Deleted",
                description: "The quiz has been successfully deleted.",
            });
        } catch (error) {
            console.error("Error deleting quiz: ", error);
            toast({
                title: "Error",
                description: "There was an error deleting the quiz.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Quizzes</h1>
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
                                Fill in the details to create a new quiz.
                            </DialogDescription>
                        </DialogHeader>
                        <QuizForm onQuizHandled={handleQuizAdded} courses={courses} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quiz Management</CardTitle>
                    <CardDescription>Manage all quizzes for your courses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Questions</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizzes.map((quiz) => (
                                <TableRow key={quiz.id}>
                                    <TableCell className="font-medium">{quiz.title}</TableCell>
                                    <TableCell>{getCourseTitle(quiz.courseId)}</TableCell>
                                    <TableCell>{quiz.questions.length}</TableCell>
                                    <TableCell className="text-right">
                                         <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/quizzes/${quiz.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the quiz.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id!)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
