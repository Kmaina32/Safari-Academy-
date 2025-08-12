
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCourse } from '@/ai/flows/course-generator';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function GenerateCoursePage() {
    const router = useRouter();
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
            const allLessons = generatedData.modules.flatMap((m, moduleIndex) => m.lessons.map((l, lessonIndex) => ({
                ...l,
                id: `m${moduleIndex + 1}-l${lessonIndex + 1}`,
            })));

            await addDoc(collection(db, 'courses'), {
                ...generatedData,
                imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(generatedData.title)}`,
                rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
                enrolledStudents: Math.floor(Math.random() * 1000),
                price: Math.floor(Math.random() * 8) * 10 + 29.99, // Random price
                lessons: allLessons,
                modules: generatedData.modules.map((m, moduleIndex) => ({
                    ...m,
                    imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(m.title)}`,
                    lessons: m.lessons.map((l, lessonIndex) => ({
                        ...l,
                        id: `m${moduleIndex + 1}-l${lessonIndex + 1}`,
                    })),
                })),
            });

            toast({
                title: 'Course Generated!',
                description: `Successfully created the course: "${generatedData.title}"`,
            });
            setCourseTopic('');
            router.push('/admin/courses');
        } catch (error) {
            console.error('Error generating course: ', error);
            toast({
                title: 'Error',
                description: 'There was an error generating the course.',
                variant: 'destructive',
            });
        } finally {
            setGenerating(false);
        }
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
                    <h1 className="text-3xl font-bold font-headline">Generate Course with AI</h1>
                    <p className="text-muted-foreground">
                        Provide a topic and let AI create a comprehensive course structure for you.
                    </p>
                </div>
            </div>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Course Topic</CardTitle>
                    <CardDescription>
                        Enter the subject you want to create a course about.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="course-topic" className="sr-only">Course Topic</Label>
                        <Input
                            id="course-topic"
                            placeholder="e.g., 'Introduction to Quantum Physics'"
                            value={courseTopic}
                            onChange={(e) => setCourseTopic(e.target.value)}
                            disabled={generating}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerateCourse} disabled={generating}>
                        {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {generating ? 'Generating...' : 'Generate Course'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
