import { CourseCard } from '@/components/courses/CourseCard';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from '@/lib/types';

async function getCourses(): Promise<Course[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() } as Course);
    });
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return []; // Return an empty array on error
  }
}


export default async function CoursesPage() {
  const courses = await getCourses();

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
      {courses.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          <p>No courses available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
