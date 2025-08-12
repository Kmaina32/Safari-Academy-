import { CourseCard } from '@/components/courses/CourseCard';
import { courses } from '@/lib/data';

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Courses</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Find the perfect course to expand your knowledge and skills.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
