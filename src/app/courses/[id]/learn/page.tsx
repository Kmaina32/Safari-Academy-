'use client';
import React from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/lib/types';

export default function CourseLearnPage({ params }: { params: { id: string } }) {
  const { id } = params; // No need for React.use(params)
  const searchParams = useSearchParams();
  const [course, setCourse] = React.useState<Course | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      const getCourse = async () => {
        try {
          const docRef = doc(db, 'courses', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
          } else {
            notFound();
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          // Handle error, maybe show a toast or an error message
        } finally {
          setLoading(false);
        }
      };
      getCourse();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!course) {
    return notFound();
  }
  
  const lessonId = searchParams.get('lesson') || course.lessons?.[0]?.id;
  const currentLesson = course.lessons?.find(l => l.id === lessonId) || course.lessons?.[0];
  if(!currentLesson) {
    return (
        <div className="container mx-auto px-4 py-12">
             <div className="text-center">
                <h1 className="text-2xl font-bold">No lessons available for this course yet.</h1>
                <p className="text-muted-foreground mt-2">Check back later!</p>
                 <Button asChild className="mt-4">
                    <Link href="/courses">Back to Courses</Link>
                </Button>
            </div>
        </div>
    )
  }

  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId);

  const nextLesson = currentLessonIndex < course.lessons.length -1 ? course.lessons[currentLessonIndex + 1] : null;
  const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const progress = ((currentLessonIndex + 1) / course.lessons.length) * 100;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold font-headline">{currentLesson.title}</h1>
                <div className="flex items-center gap-2">
                    {prevLesson && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/courses/${id}/learn?lesson=${prevLesson.id}`}><ChevronLeft className="mr-2 h-4 w-4" /> Previous</Link>
                        </Button>
                    )}
                    {nextLesson && (
                        <Button size="sm" asChild>
                            <Link href={`/courses/${id}/learn?lesson=${nextLesson.id}`}>Next <ChevronRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            </header>
            <Card>
                <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                        <p className="text-muted-foreground">Video player will go here</p>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">About this lesson</h2>
                    <div className="prose max-w-none text-foreground">
                        <p>{currentLesson.content}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
             <div className="sticky top-24">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold font-headline truncate">{course.title}</CardTitle>
                        <div className="mt-2 space-y-1">
                            <Progress value={progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">{Math.round(progress)}% complete</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                            {course.modules?.map((module, moduleIndex) => (
                            <AccordionItem value={`item-${moduleIndex}`} key={module.title}>
                                <AccordionTrigger className="text-left font-semibold hover:no-underline">{module.title}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-1">
                                        {module.lessons.map((lesson) => (
                                            <li key={lesson.id}>
                                                <Button variant={lesson.id === lessonId ? 'secondary' : 'ghost'} className="w-full justify-start h-auto py-2" asChild>
                                                    <Link href={`/courses/${id}/learn?lesson=${lesson.id}`} className="flex items-start">
                                                        <PlayCircle className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" />
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-sm text-wrap text-left">{lesson.title}</span>
                                                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                                        </div>
                                                    </Link>
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
             </div>
        </div>
      </div>
    </div>
  );
}
