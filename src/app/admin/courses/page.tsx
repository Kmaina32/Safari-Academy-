import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const courses = [
  { id: 'course-1', title: 'Introduction to Web Development', imageUrl: 'https://placehold.co/64x64', status: 'Published', enrolled: 1204, rating: 4.8 },
  { id: 'course-2', title: 'Advanced Graphic Design', imageUrl: 'https://placehold.co/64x64', status: 'Published', enrolled: 852, rating: 4.9 },
  { id: 'course-3', title: 'Digital Marketing Essentials', imageUrl: 'https://placehold.co/64x64', status: 'Draft', enrolled: 2341, rating: 4.7 },
  { id: 'course-4', title: 'The Art of Public Speaking', imageUrl: 'https://placehold.co/64x64', status: 'Published', enrolled: 950, rating: 4.8 },
];

export default function AdminCoursesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">Courses</h1>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Course
                </Button>
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
                                        <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>{course.status}</Badge>
                                    </TableCell>
                                    <TableCell>{course.enrolled.toLocaleString()}</TableCell>
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
