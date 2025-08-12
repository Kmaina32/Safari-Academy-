
'use client';
import React from 'react';
import { courses } from '@/lib/data';
import { notFound, useSearchParams } from 'next/navigation';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Progress } from '@/components/ui/progress';

export default function CourseLearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const searchParams = useSearchParams();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  const lessonId = searchParams.get('lesson') || course.lessons[0].id;
  const currentLesson = course.lessons.find(l => l.id === lessonId) || course.lessons[0];
  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId);

  const nextLesson = currentLessonIndex < course.lessons.length -1 ? course.lessons[currentLessonIndex + 1] : null;
  const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar collapsible="icon" className="group" side="left">
            <SidebarHeader>
                <div className="h-16 flex items-center px-4 -ml-2 group-data-[collapsible=icon]:-ml-0 group-data-[collapsible=icon]:px-2">
                  <Logo />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-2 group-data-[collapsible=icon]:px-2">
                        <h2 className="font-bold font-headline text-lg truncate group-data-[collapsible=icon]:hidden">{course.title}</h2>
                        <div className="mt-2 space-y-1 group-data-[collapsible=icon]:hidden">
                            <Progress value={33} className="h-2" />
                            <span className="text-xs text-muted-foreground">33% complete</span>
                        </div>
                    </div>

                    <Accordion type="single" collapsible defaultValue="item-0" className="w-full group-data-[collapsible=icon]:hidden">
                        {course.modules.map((module, moduleIndex) => (
                        <AccordionItem value={`item-${moduleIndex}`} key={module.title}>
                            <AccordionTrigger className="px-4 text-left font-semibold hover:no-underline">{module.title}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="px-2 py-2 space-y-1">
                                    {module.lessons.map((lesson) => (
                                        <li key={lesson.id}>
                                            <Button variant={lesson.id === lessonId ? 'secondary' : 'ghost'} className="w-full justify-start h-auto py-2" asChild>
                                                <Link href={`?lesson=${lesson.id}`} className="flex items-start">
                                                    <CheckCircle className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" />
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
                     <div className="hidden group-data-[collapsible=icon]:block px-2 py-4">
                        {course.lessons.map(l => (
                            <Link href={`?lesson=${l.id}`} key={l.id}>
                                <div className={`h-10 w-10 flex items-center justify-center rounded-md ${l.id === lessonId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <PlayCircle className="w-5 h-5"/>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </SidebarContent>
            <SidebarFooter className="group-data-[collapsible=icon]:hidden">
                <Button variant="outline" asChild>
                    <Link href="/dashboard"><ChevronLeft className="mr-2 h-4 w-4"/> Back to Dashboard</Link>
                </Button>
            </SidebarFooter>
        </Sidebar>

        <main className="flex-1 md:ml-[var(--sidebar-width-icon)] lg:ml-[var(--sidebar-width)] transition-all duration-200">
            <header className="flex items-center justify-between h-16 px-6 border-b bg-background">
                <div className="flex items-center">
                    <div className="md:hidden">
                        <SidebarTrigger>
                          <Button variant="ghost" size="icon">
                            <PlayCircle />
                          </Button>
                        </SidebarTrigger>
                    </div>
                    <h1 className="text-xl font-semibold font-headline ml-2">{currentLesson.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    {prevLesson && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`?lesson=${prevLesson.id}`}><ChevronLeft className="mr-2 h-4 w-4" /> Previous</Link>
                        </Button>
                    )}
                    {nextLesson && (
                        <Button size="sm" asChild>
                            <Link href={`?lesson=${nextLesson.id}`}>Next <ChevronRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    )}
                </div>
            </header>
            <div className="p-6">
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
        </main>
      </div>
    </SidebarProvider>
  );
}
