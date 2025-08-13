
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCourse } from '@/ai/flows/course-generator';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Textarea } from '@/components/ui/textarea';

export default function GenerateCoursePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [generating, setGenerating] = useState(false);
    const [courseTopic, setCourseTopic] = useState('');

    const handleGenerateCourse = async () => {
        if (!courseTopic) {
            toast({
                title: 'Topic Required',
                description: 'Please paste the raw course data into the text area.',
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
                imageUrl: `https://placehold.co/600x400`,
                rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
                enrolledStudents: Math.floor(Math.random() * 1000),
                price: Math.floor(Math.random() * 8) * 10 + 29.99,
                status: 'Draft',
                targetAudience: 'Beginners',
                prerequisites: 'None',
                lessons: allLessons,
                modules: generatedData.modules.map((m, moduleIndex) => ({
                    ...m,
                    imageUrl: `https://placehold.co/600x400`,
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
                description: 'There was an error generating the course. The AI may not have been able to parse the format.',
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
                        Paste raw course text and let AI create a structured course for you.
                    </p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Course Raw Data</CardTitle>
                    <CardDescription>
                        Paste the full text content for the course below. The AI will parse it into modules and lessons.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="course-topic" className="sr-only">Course Data</Label>
                        <Textarea
                            id="course-topic"
                            placeholder="Paste your course content here..."
                            value={courseTopic}
                            onChange={(e) => setCourseTopic(e.target.value)}
                            disabled={generating}
                            rows={15}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerateCourse} disabled={generating}>
                        {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {generating ? 'Generating...' : 'Generate Course'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
