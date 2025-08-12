import { courses } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User, Clock, PlayCircle, Lock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <div className="relative mb-6">
            <Image
              src={course.imageUrl}
              alt={course.title}
              width={1200}
              height={675}
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              data-ai-hint="online course"
            />
            <Badge className="absolute top-4 left-4" variant="secondary">{course.category}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{course.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
          <div className="prose max-w-none text-foreground">
            <p>{course.longDescription}</p>
          </div>
        </div>
        <div>
          <div className="sticky top-24">
            <div className="border rounded-lg bg-card text-card-foreground p-6 shadow-lg">
                <div className="flex items-center gap-2 text-2xl font-bold mb-4">
                    <span className="text-primary">$49.99</span>
                    <span className="text-base font-normal text-muted-foreground line-through">$99.99</span>
                </div>
                <Button size="lg" className="w-full mb-4">Enroll Now</Button>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground"/>
                        <span>Instructor: <strong>{course.instructor}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-accent fill-accent"/>
                        <span>{course.rating} ({course.enrolledStudents} students)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground"/>
                        <span>Duration: {course.duration}</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 border rounded-lg bg-card text-card-foreground shadow-lg">
                <h3 className="text-lg font-bold font-headline p-4 border-b">Course Content</h3>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="px-4">Module 1: Getting Started</AccordionTrigger>
                        <AccordionContent>
                           <ul className="px-4 py-2 space-y-2">
                                {course.lessons.map((lesson, index) => (
                                    <li key={lesson.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            {index === 0 ? <PlayCircle className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-muted-foreground"/>}
                                            <span>{lesson.title}</span>
                                        </div>
                                        <span className="text-muted-foreground">{lesson.duration}</span>
                                    </li>
                                ))}
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
