import type { Course, EnrolledCourse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface EnrolledCourseCardProps {
  course: Course & EnrolledCourse;
}

export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={course.imageUrl}
            alt={course.title}
            width={600}
            height={400}
            className="w-full h-40 object-cover"
            data-ai-hint="online course abstract"
          />
        </div>
        <div className="p-4 pb-2">
          <CardTitle className="text-base font-bold font-headline leading-tight">
            <Link href={`/courses/${course.id}/learn`} className="hover:text-primary transition-colors">{course.title}</Link>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">by {course.instructor}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="space-y-2">
            <Progress value={course.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{course.progress}% complete ({course.completedLessons}/{course.totalLessons} lessons)</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant="outline" size="sm">
            <Link href={`/courses/${course.id}/learn`}>
                <PlayCircle className="mr-2 h-4 w-4"/>
                Continue Learning
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
