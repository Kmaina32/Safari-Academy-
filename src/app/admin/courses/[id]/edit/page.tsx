
'use client';

import { CourseForm, type CourseFormValues } from "@/components/admin/CourseForm";
import { useRouter, useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema as courseFormSchema } from "@/components/admin/CourseForm";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function EditCourseSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-80" />
                </div>
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                 <div className="flex gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<CourseFormValues | null>(null);

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
          title: "",
          description: "",
          longDescription: "",
          instructor: "",
          category: "",
          duration: "",
          status: "Draft",
          targetAudience: "",
          prerequisites: "",
          isFree: false,
          price: 0,
          modules: [],
        },
      });

    useEffect(() => {
        if (!courseId) return;

        const fetchCourse = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "courses", courseId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const courseData = docSnap.data() as Course;
                    const formData: CourseFormValues = {
                        title: courseData.title,
                        description: courseData.description,
                        longDescription: courseData.longDescription || '',
                        instructor: courseData.instructor,
                        category: courseData.category,
                        duration: courseData.duration,
                        status: courseData.status || 'Draft',
                        targetAudience: courseData.targetAudience || '',
                        prerequisites: courseData.prerequisites || '',
                        isFree: courseData.price === 0,
                        price: courseData.price,
                        modules: courseData.modules.map(m => ({
                            title: m.title,
                            imageUrl: m.imageUrl || 'https://placehold.co/600x400',
                            lessons: m.lessons.map(l => ({
                                title: l.title,
                                content: l.content,
                                videoUrl: l.videoUrl || '',
                                duration: l.duration || '',
                            }))
                        }))
                    };
                    setInitialData(formData);
                    form.reset(formData);
                } else {
                    notFound();
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                notFound();
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, form]);

    const handleCourseUpdated = () => {
        router.push('/admin/courses');
    };

    if (loading) {
        return <EditCourseSkeleton />;
    }

    if (!initialData) {
        // This case is handled by notFound() in useEffect, but as a fallback
        return <div>Course not found.</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/courses">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Edit Course</h1>
                    <p className="text-muted-foreground">Update the details for "{initialData.title}".</p>
                </div>
            </div>
            
            <CourseForm 
                onCourseHandled={handleCourseUpdated} 
                form={form} 
                initialData={initialData}
                courseId={courseId}
            />
        </div>
    );
}
