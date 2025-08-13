
'use client';
import React from 'react';
import { notFound, useSearchParams, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, PlayCircle, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course, Module, Lesson } from '@/lib/types';
import { VideoPlayer } from '@/components/courses/VideoPlayer';
import { Skeleton } from '@/components/ui/skeleton';

function CourseLearnSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <Skeleton className="h-9 w-3/4" />
                    <Skeleton className="aspect-video w-full rounded-lg" />
                     <div className="space-y-4">
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-4/5" />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function CourseLearnPage() {
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const [course, setCourse] = React.useState<Course | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(0);

  const lessonId = searchParams.get('lesson') || course?.lessons?.[0]?.id;

  React.useEffect(() => {
    if (id) {
      const getCourse = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, 'courses', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
          } else {
            setCourse(null)
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          setCourse(null)
        } finally {
          setLoading(false);
        }
      };
      getCourse();
    } else {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    // Reset page to 0 when lesson changes
    setCurrentPage(0);
  }, [lessonId]);

  if (loading) {
    return <CourseLearnSkeleton />;
  }

  if (!course) {
    return notFound();
  }
  
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

  const allLessons = course.modules?.flatMap(m => m.lessons) || course.lessons || [];
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentLessonIndex < allLessons.length -1 ? allLessons[currentLessonIndex + 1] : null;
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const progress = ((currentLessonIndex + 1) / allLessons.length) * 100;

  const findModuleForLesson = (lessonId: string): Module | undefined => {
      return course.modules?.find(m => m.lessons.some(l => l.id === lessonId));
  }

  const currentModule = findModuleForLesson(currentLesson.id);

  const lessonPages = currentLesson.content.split('\n').filter(p => p.trim() !== '');
  const totalPages = lessonPages.length;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
            <div className="flex flex-col space-y-6">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden border shadow-lg">
                    <VideoPlayer videoUrl={currentLesson.videoUrl} />
                </div>
                 <header className="space-y-2">
                    <p className="text-sm font-semibold text-primary">{currentModule?.title || course.title}</p>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline">{currentLesson.title}</h1>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Lesson Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose max-w-none text-foreground text-base min-h-[12rem]">
                            <p>{lessonPages[currentPage]}</p>
                        </div>
                    </CardContent>
                     {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t p-4">
                            <Button variant="outline" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Page
                            </Button>
                            <span className="text-sm font-medium text-muted-foreground">Page {currentPage + 1} of {totalPages}</span>
                            <Button variant="outline" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages - 1}>
                                Next Page <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </Card>

                 <div className="flex items-center justify-between pt-4 border-t">
                    {prevLesson ? (
                        <Button variant="outline" size="lg" asChild>
                            <Link href={`/courses/${id}/learn?lesson=${prevLesson.id}`}><ChevronLeft className="mr-2 h-4 w-4" /> Previous Lesson</Link>
                        </Button>
                    ) : <div />}
                    {nextLesson ? (
                        <Button size="lg" asChild>
                            <Link href={`/courses/${id}/learn?lesson=${nextLesson.id}`}>Next Lesson <ChevronRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    ) : (
                         <Button size="lg" disabled>
                            <CheckCircle className="mr-2 h-4 w-4" /> Course Complete
                        </Button>
                    )}
                </div>
            </div>
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-bold font-headline truncate">{course.title}</CardTitle>
                        <div className="mt-2 space-y-1">
                             <span className="text-xs text-muted-foreground">{Math.round(progress)}% complete</span>
                            <Progress value={progress} className="h-2" />
                           
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Course Curriculum</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                         <Accordion type="single" collapsible defaultValue={currentModule?.title} className="w-full">
                            {course.modules?.map((module, moduleIndex) => (
                            <AccordionItem value={module.title} key={module.title}>
                                <AccordionTrigger className="text-left font-semibold hover:no-underline px-6">{module.title}</AccordionTrigger>
                                <AccordionContent className="p-0">
                                    <ul className="space-y-1 py-2">
                                        {module.lessons.map((lesson) => {
                                            const isCurrent = lesson.id === lessonId;
                                            const isCompleted = allLessons.findIndex(l => l.id === lesson.id) < currentLessonIndex;
                                            
                                            return (
                                                <li key={lesson.id}>
                                                    <Button variant={isCurrent ? 'secondary' : 'ghost'} className="w-full justify-start h-auto py-3 px-6 rounded-none" asChild>
                                                        <Link href={`/courses/${id}/learn?lesson=${lesson.id}`} className="flex items-start text-left">
                                                            {isCurrent ? <PlayCircle className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" /> : isCompleted ? <CheckCircle className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" /> : <PlayCircle className="w-4 h-4 mr-3 mt-1 text-muted-foreground/70 flex-shrink-0" />}
                                                            <div className="flex flex-col items-start">
                                                                <span className="text-sm text-wrap">{lesson.title}</span>
                                                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                                            </div>
                                                        </Link>
                                                    </Button>
                                                </li>
                                            )
                                        })}
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
