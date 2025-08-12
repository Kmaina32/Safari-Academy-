import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CourseCard } from '@/components/courses/CourseCard';
import Link from 'next/link';
import { courses } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative pt-16 md:pt-24 pb-16 md:pb-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 top-0 h-full w-full bg-background [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground mb-6">
              Unlock Your Potential with Safari Academy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore a world of knowledge with our expert-led courses. Start your learning journey today and achieve your goals.
            </p>
            <Button size="lg" asChild>
              <Link href="/courses">
                Browse Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="featured-courses" className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured Courses</h2>
          <p className="text-lg text-muted-foreground mt-2">
            Handpicked courses to kickstart your learning adventure.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="text-center mt-12">
            <Button variant="outline" asChild>
                <Link href="/courses">View All Courses</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
