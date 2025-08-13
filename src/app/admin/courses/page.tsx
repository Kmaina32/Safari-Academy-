
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, ArrowUpDown, Trash2, Sparkles, Pencil, Eye, Binary } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
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


const htmlCourseData: Omit<Course, 'id' | 'rating' | 'enrolledStudents' | 'imageUrl'> = {
  title: "HTML Basics – Full Beginner Course",
  description: "This course introduces absolute beginners to HTML (HyperText Markup Language), the foundation of every website.",
  longDescription: "This course introduces absolute beginners to HTML (HyperText Markup Language), the foundation of every website. You’ll learn how to structure content, work with text, images, links, and forms, and build clean, semantic web pages. The lessons include explanations, examples, exercises, and a final project.",
  instructor: "Web Dev Pro",
  category: "Development",
  duration: "6 weeks",
  price: 0,
  status: "Published",
  targetAudience: "Absolute beginners with no prior coding experience. Ideal for anyone looking to start a career in web development or simply understand how websites are built.",
  prerequisites: "A computer with internet access and a web browser. No prior knowledge is required.",
  modules: [
    {
      title: "Module 1: Introduction to HTML",
      imageUrl: "https://placehold.co/600x400",
      lessons: [
        { id: "m1-l1", title: "What is HTML?", duration: "5 min", content: "Learn what HTML is, how the web works, and how HTML fits into web development. We’ll cover how browsers interpret HTML and the relationship between HTML, CSS, and JavaScript." },
        { id: "m1-l2", title: "Setting Up Your Tools", duration: "8 min", content: "Learn how to set up a simple code editor (like VS Code or Sublime Text) and create your very first HTML file to be opened in a browser." }
      ]
    },
    {
      title: "Module 2: HTML Document Structure",
      imageUrl: "https://placehold.co/600x400",
      lessons: [
        { id: "m2-l1", title: "The Core Tags", duration: "10 min", content: "HTML documents follow a specific structure. You’ll learn about <!DOCTYPE html>, <html>, <head>, and <body> tags." },
        { id: "m2-l2", title: "Metadata and the Head", duration: "12 min", content: "Explore the <head> section, which contains metadata like the <title> and <meta> tags for character sets and search engine optimization." }
      ]
    },
    {
      title: "Module 3: Text Elements",
      imageUrl: "https://placehold.co/600x400",
      lessons: [
        { id: "m3-l1", title: "Headings and Paragraphs", duration: "10 min", content: "Learn to display text using headings (<h1>–<h6>) for structure and paragraphs (<p>) for text blocks. We'll also cover line breaks (<br>)." },
        { id: "m3-l2", title: "Text Formatting", duration: "15 min", content: "Explore inline formatting tags like <strong> for bold, <em> for emphasis/italic, <u> for underline, and how to quote text with <blockquote> and <q>." }
      ]
    },
    {
      title: "Module 4: Links and Images",
      imageUrl: "https://placehold.co/600x400",
      lessons: [
        { id: "m4-l1", title: "Creating Hyperlinks", duration: "15 min", content: "Links (<a>) connect web pages. This lesson covers the href attribute for internal and external links, and the target attribute for opening links in new tabs." },
        { id: "m4-l2", title: "Displaying Images", duration: "12 min", content: "Images (<img>) add visual content. Learn the syntax, including the src attribute for the source and the essential alt attribute for accessibility." }
      ]
    },
    {
      title: "Module 5: Lists and Tables",
      imageUrl: "https://placehold.co/600x400",
      lessons: [
        { id: "m5-l1", title: "Organizing with Lists", duration: "15 min", content: "Lists help group related items. We’ll explore ordered lists (<ol>), unordered lists (<ul>), definition lists (<dl>), and how to nest them." },
        { id: "m5-l2", title: "Structuring Data with Tables", duration: "20 min", content: "Tables organize data into rows and columns. We’ll cover the main table tags: <table>, <tr>, <th>, and <td>." }
      ]
    },
    {
      title: "Module 6: Forms and Inputs",
      imageUrl: "https://placehold.co/600x400",
      lessons: [
        { id: "m6-l1", title: "Building Forms", duration: "18 min", content: "Forms allow user interaction. This lesson covers the <form> element and its attributes like action and method." },
        { id: "m6-l2", title: "Input Types", duration: "25 min", content: "Learn about various input types like text, password, email, number, as well as <label>, <textarea>, and <select> dropdowns." }
      ]
    },
    {
      title: "Module 7: Semantic HTML",
      imageUrl: "https://placehold.co/600x400",
      lessons: [
        { id: "m7-l1", title: "Why Semantic HTML Matters", duration: "10 min", content: "Semantic HTML uses tags that describe their purpose, making sites easier for search engines and assistive technologies to understand." },
        { id: "m7-l2", title: "Layout Elements", duration: "20 min", content: "Learn how to use common semantic elements like <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer> to structure your page." }
      ]
    },
    {
      title: "Module 8: Final Project",
      imageUrl: "https://placehold.co/600x400",
      lessons: [
        { id: "m8-l1", title: "Build Your Personal Portfolio", duration: "45 min", content: "Apply everything you've learned to build a complete, single-page personal portfolio site. This project will include a header, navigation, about section, image gallery, contact form, and footer, all built with semantic HTML." }
      ]
    }
  ],
  // Flatten lessons for top-level access
  lessons: [
    { id: "m1-l1", title: "What is HTML?", duration: "5 min", content: "Learn what HTML is, how the web works, and how HTML fits into web development. We’ll cover how browsers interpret HTML and the relationship between HTML, CSS, and JavaScript." },
    { id: "m1-l2", title: "Setting Up Your Tools", duration: "8 min", content: "Learn how to set up a simple code editor (like VS Code or Sublime Text) and create your very first HTML file to be opened in a browser." },
    { id: "m2-l1", title: "The Core Tags", duration: "10 min", content: "HTML documents follow a specific structure. You’ll learn about <!DOCTYPE html>, <html>, <head>, and <body> tags." },
    { id: "m2-l2", title: "Metadata and the Head", duration: "12 min", content: "Explore the <head> section, which contains metadata like the <title> and <meta> tags for character sets and search engine optimization." },
    { id: "m3-l1", title: "Headings and Paragraphs", duration: "10 min", content: "Learn to display text using headings (<h1>–<h6>) for structure and paragraphs (<p>) for text blocks. We'll also cover line breaks (<br>)." },
    { id: "m3-l2", title: "Text Formatting", duration: "15 min", content: "Explore inline formatting tags like <strong> for bold, <em> for emphasis/italic, <u> for underline, and how to quote text with <blockquote> and <q>." },
    { id: "m4-l1", title: "Creating Hyperlinks", duration: "15 min", content: "Links (<a>) connect web pages. This lesson covers the href attribute for internal and external links, and the target attribute for opening links in new tabs." },
    { id: "m4-l2", title: "Displaying Images", duration: "12 min", content: "Images (<img>) add visual content. Learn the syntax, including the src attribute for the source and the essential alt attribute for accessibility." },
    { id: "m5-l1", title: "Organizing with Lists", duration: "15 min", content: "Lists help group related items. We’ll explore ordered lists (<ol>), unordered lists (<ul>), definition lists (<dl>), and how to nest them." },
    { id: "m5-l2", title: "Structuring Data with Tables", duration: "20 min", content: "Tables organize data into rows and columns. We’ll cover the main table tags: <table>, <tr>, <th>, and <td>." },
    { id: "m6-l1", title: "Building Forms", duration: "18 min", content: "Forms allow user interaction. This lesson covers the <form> element and its attributes like action and method." },
    { id: "m6-l2", title: "Input Types", duration: "25 min", content: "Learn about various input types like text, password, email, number, as well as <label>, <textarea>, and <select> dropdowns." },
    { id: "m7-l1", title: "Why Semantic HTML Matters", duration: "10 min", content: "Semantic HTML uses tags that describe their purpose, making sites easier for search engines and assistive technologies to understand." },
    { id: "m7-l2", title: "Layout Elements", duration: "20 min", content: "Learn how to use common semantic elements like <header>, <nav>, <main>, <section>, <article>, <aside>, and <footer> to structure your page." },
    { id: "m8-l1", title: "Build Your Personal Portfolio", duration: "45 min", content: "Apply everything you've learned to build a complete, single-page personal portfolio site. This project will include a header, navigation, about section, image gallery, contact form, and footer, all built with semantic HTML." }
  ]
};


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
    
    const handleSeedCourse = async () => {
        try {
            await addDoc(collection(db, "courses"), {
                ...htmlCourseData,
                imageUrl: `https://placehold.co/600x400`,
                rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
                enrolledStudents: Math.floor(Math.random() * 2000) + 500,
            });
            toast({
                title: "Course Seeded!",
                description: "The HTML Basics course has been added to your database.",
            });
        } catch (error) {
             console.error("Error seeding course: ", error);
            toast({
                title: "Error",
                description: "There was an error seeding the course.",
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
                        <Button variant="secondary" onClick={handleSeedCourse}>
                            <Binary className="mr-2 h-4 w-4" />
                            Seed HTML Course (Temp)
                        </Button>
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
