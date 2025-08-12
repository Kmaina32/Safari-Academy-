
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
import { AssignmentForm } from "@/components/admin/AssignmentForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Assignment } from '@/lib/types';
import Link from 'next/link';

export default function AdminAssignmentsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
     const [courses, setCourses] = useState<{id: string, title: string}[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "assignments"), (snapshot) => {
            const assignmentsData: Assignment[] = [];
            snapshot.forEach((doc) => {
                assignmentsData.push({ id: doc.id, ...doc.data() } as Assignment);
            });
            setAssignments(assignmentsData);
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

    const handleAssignmentAdded = () => {
        setIsDialogOpen(false);
    }

    const getCourseTitle = (courseId: string) => {
        return courses.find(c => c.id === courseId)?.title || 'Unknown Course';
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Assignments</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Assignment
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Assignment</DialogTitle>
                            <DialogDescription>
                                Fill in the details to create a new assignment.
                            </DialogDescription>
                        </DialogHeader>
                        <AssignmentForm onAssignmentAdded={handleAssignmentAdded} courses={courses} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assignment Management</CardTitle>
                    <CardDescription>Manage all assignments for your courses.</CardDescription>
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
                            {assignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell className="font-medium">{assignment.title}</TableCell>
                                    <TableCell>{getCourseTitle(assignment.courseId)}</TableCell>
                                    <TableCell>{assignment.questions.length}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {assignments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No assignments found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
