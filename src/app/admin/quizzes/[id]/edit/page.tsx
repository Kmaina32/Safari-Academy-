
'use client';

import { QuizForm, type QuizFormValues } from "@/components/admin/QuizForm";
import { useRouter, useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema as quizFormSchema } from "@/components/admin/QuizForm";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Quiz } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function EditQuizSkeleton() {
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
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<QuizFormValues | null>(null);
    const [courses, setCourses] = useState<{id: string, title: string}[]>([]);

    const form = useForm<QuizFormValues>({
        resolver: zodResolver(quizFormSchema),
        defaultValues: {
          title: "",
          courseId: "",
          questions: [],
        },
    });

    useEffect(() => {
        if (!quizId) return;

        const fetchCourses = async () => {
            const querySnapshot = await getDocs(collection(db, "courses"));
            const coursesData: {id: string, title: string}[] = [];
            querySnapshot.forEach(doc => {
                coursesData.push({ id: doc.id, title: doc.data().title });
            });
            setCourses(coursesData);
        };

        const fetchQuiz = async () => {
            try {
                const docRef = doc(db, "quizzes", quizId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const quizData = docSnap.data() as Quiz;
                    setInitialData(quizData);
                    form.reset(quizData);
                } else {
                    notFound();
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
                notFound();
            }
        };

        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchCourses(), fetchQuiz()]);
            setLoading(false);
        }

        loadData();
    }, [quizId, form]);

    const handleQuizUpdated = () => {
        router.push('/admin/quizzes');
    };

    if (loading) {
        return <EditQuizSkeleton />;
    }

    if (!initialData) {
        return <div>Quiz not found.</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/quizzes">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline">Edit Quiz</h1>
                    <p className="text-muted-foreground">Update the details for "{initialData.title}".</p>
                </div>
            </div>
            
            <QuizForm 
                onQuizHandled={handleQuizUpdated} 
                form={form} 
                initialData={initialData}
                quizId={quizId}
                courses={courses}
            />
        </div>
    );
}
