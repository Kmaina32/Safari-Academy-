import type { Course } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, User, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={course.imageUrl}
            alt={course.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint="online course"
          />
          <Badge className="absolute top-3 right-3" variant="secondary">{course.category}</Badge>
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="text-lg font-bold font-headline leading-tight">
            <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">{course.title}</Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-4">
            <div className="flex items-center gap-1.5">
                <User className="w-4 h-4"/>
                <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-accent fill-accent"/>
                <span>{course.rating}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
            <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
