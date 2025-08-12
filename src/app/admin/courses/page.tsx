
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, ArrowUpDown, Trash2, Sparkles, Pencil, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from '@/lib/types';
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
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";


export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const q = collection(db, "courses");
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const coursesData: Course[] = [];
            querySnapshot.forEach((doc) => {
                coursesData.push({ id: doc.id, ...doc.data() } as Course);
            });
            setCourses(coursesData);
        }, (error) => {
            console.error("Error fetching courses: ", error);
            toast({
                title: "Error",
                description: "Failed to fetch courses. Check Firestore permissions.",
                variant: "destructive",
            });
        });

        return () => unsubscribe();
    }, [toast]);

    const handleDeleteCourse = async (courseId: string) => {
        try {
            await deleteDoc(doc(db, "courses", courseId));
            toast({
                title: "Course Deleted",
                description: "The course has been successfully deleted.",
            });
        } catch (error) {
            console.error("Error deleting course: ", error);
            toast({
                title: "Error",
                description: "There was an error deleting the course.",
                variant: "destructive",
            });
        }
    };


    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold font-headline">Courses</h1>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/courses/generate">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate with AI
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/courses/new">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Course
                            </Link>
                        </Button>
                     </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Course Management</CardTitle>
                        <CardDescription>Manage your courses and view their performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="p-0 hover:bg-transparent">
                                            Course
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" className="p-0 hover:bg-transparent">
                                            Enrolled
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map(course => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <Image src={course.imageUrl} alt={course.title} width={40} height={40} className="rounded-md" data-ai-hint="course thumbnail" />
                                        </TableCell>
                                        <TableCell className="font-medium">{course.title}</TableCell>
                                        <TableCell>
                                            <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                                                {course.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{course.enrolledStudents.toLocaleString()}</TableCell>
                                        <TableCell>{course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}</TableCell>
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
                                                            <Link href={`/courses/${course.id}`} target="_blank">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Course
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/courses/${course.id}/edit`}>
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
                                                            This action cannot be undone. This will permanently delete the course
                                                            and remove all associated data.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteCourse(course.id!)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
