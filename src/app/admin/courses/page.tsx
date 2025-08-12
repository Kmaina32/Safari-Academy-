'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CourseForm } from "@/components/admin/CourseForm";


export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const q = collection(db, "courses");
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const coursesData: Course[] = [];
            querySnapshot.forEach((doc) => {
                coursesData.push({ id: doc.id, ...doc.data() } as Course);
            });
            setCourses(coursesData);
        });

        return () => unsubscribe();
    }, []);

    const handleCourseAdded = () => {
        setIsDialogOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Courses</h1>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                         <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new course.
                        </DialogDescription>
                        </DialogHeader>
                        <CourseForm onCourseAdded={handleCourseAdded}/>
                    </DialogContent>
                </Dialog>
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
                                <TableHead>Rating</TableHead>
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
                                        <Badge variant={'secondary'}>Draft</Badge>
                                    </TableCell>
                                    <TableCell>{course.enrolledStudents.toLocaleString()}</TableCell>
                                    <TableCell>{course.rating}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
