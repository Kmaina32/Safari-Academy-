
'use client';

import { CourseForm } from "@/components/admin/CourseForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewCoursePage() {
    const router = useRouter();

    const handleCourseAdded = () => {
        router.push('/admin/courses');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/courses">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Create a New Course</h1>
                    <p className="text-muted-foreground">Fill in the details below to create a new course.</p>
                </div>
            </div>
            <CourseForm onCourseAdded={handleCourseAdded} />
        </div>
    );
}
