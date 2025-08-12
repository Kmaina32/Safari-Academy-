
'use client';

import { CourseForm } from "@/components/admin/CourseForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateCourse, type CourseGeneratorOutput } from "@/ai/flows/course-generator";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema as courseFormSchema, type CourseFormValues } from "@/components/admin/CourseForm";

function AiGenerator({ form, setFormKey }: { form: UseFormReturn<CourseFormValues>, setFormKey: React.Dispatch<React.SetStateAction<number>> }) {
    const { toast } = useToast();
    const [generating, setGenerating] = useState(false);
    const [courseTopic, setCourseTopic] = useState('');

    const handleGenerateCourse = async () => {
        if (!courseTopic) {
            toast({
                title: 'Topic Required',
                description: 'Please enter a topic for the course.',
                variant: 'destructive',
            });
            return;
        }
        setGenerating(true);
        try {
            const generatedData = await generateCourse({ topic: courseTopic });

            // This is the key part: we reset the form with the new AI-generated data.
            form.reset({
                title: generatedData.title,
                description: generatedData.description,
                longDescription: generatedData.longDescription,
                instructor: generatedData.instructor,
                category: generatedData.category,
                duration: generatedData.duration,
                isFree: false,
                price: 29.99, // Default price
                modules: generatedData.modules.map(m => ({
                    ...m,
                    imageUrl: `https://placehold.co/600x400`,
                    lessons: m.lessons.map(l => ({
                        ...l,
                        videoUrl: l.videoUrl || ''
                    }))
                }))
            });
            // Force re-render of the form component with new defaults
            setFormKey(prev => prev + 1);

            toast({
                title: 'Content Generated!',
                description: `The form has been populated with content for "${generatedData.title}". Please review and save.`,
            });
            setCourseTopic('');
        } catch (error) {
            console.error('Error generating course: ', error);
            toast({
                title: 'Error',
                description: 'There was an error generating the course content.',
                variant: 'destructive',
            });
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent" /> Generate with AI</CardTitle>
                <CardDescription>
                    Provide a topic and let AI create a course draft for you. The form below will be auto-filled.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="course-topic">Course Topic</Label>
                    <div className="flex gap-2">
                    <Input
                        id="course-topic"
                        placeholder="e.g., 'Introduction to Quantum Physics'"
                        value={courseTopic}
                        onChange={(e) => setCourseTopic(e.target.value)}
                        disabled={generating}
                        className="flex-grow"
                    />
                     <Button onClick={handleGenerateCourse} disabled={generating} className="w-[180px]">
                        {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {generating ? 'Generating...' : 'Generate Content'}
                    </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function NewCoursePage() {
    const router = useRouter();
    const [formKey, setFormKey] = useState(0);

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
          title: "",
          description: "",
          longDescription: "",
          instructor: "",
          category: "",
          duration: "",
          isFree: false,
          price: 29.99,
          modules: [{ title: "Module 1", imageUrl: "https://placehold.co/600x400", lessons: [{ title: "Lesson 1", content: "", videoUrl: "" }] }],
        },
      });

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
                    <p className="text-muted-foreground">Fill in the details manually or use AI to generate a draft.</p>
                </div>
            </div>
            
            <AiGenerator form={form} setFormKey={setFormKey} />

            <CourseForm key={formKey} onCourseAdded={handleCourseAdded} form={form} />
        </div>
    );
}
