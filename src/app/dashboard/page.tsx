import { EnrolledCourseCard } from "@/components/dashboard/EnrolledCourseCard";
import { user } from "@/lib/data";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course, EnrolledCourse as EnrolledCourseType } from '@/lib/types';

// This is a placeholder for fetching user-specific enrollments
async function getUserEnrolledCourses(userId: string): Promise<(Course & EnrolledCourseType)[]> {
    // In a real app, you'd fetch enrollment data for the user from an 'enrollments' collection
    // and then fetch the details for those courses.
    const enrolledCourses: EnrolledCourseType[] = []; // This would be dynamic based on the logged-in user
    const courseIds = enrolledCourses.map(e => e.courseId);

    // If the user has no enrolled courses, show the first 2 courses from the database as a demo
    if (courseIds.length === 0) {
        const coursesQuery = query(collection(db, "courses"), limit(2));
        const querySnapshot = await getDocs(coursesQuery);
        const courses: Course[] = [];
        querySnapshot.forEach(doc => {
            courses.push({ id: doc.id, ...doc.data() } as Course);
        });

        // Create fake enrollment data for the demo courses
        return courses.map(course => ({
            ...course,
            courseId: course.id!,
            progress: Math.floor(Math.random() * 100),
            completedLessons: Math.floor(Math.random() * (course.lessons?.length || 0)),
            totalLessons: course.lessons?.length || 10,
        }));
    }

    // This part of the code would run if the user was actually enrolled in courses.
    // It is correct but currently unreachable until a real enrollment system is built.
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, where("__name__", "in", courseIds));
    
    const querySnapshot = await getDocs(q);
    const coursesData: { [key: string]: Course } = {};
    querySnapshot.forEach(doc => {
        coursesData[doc.id] = { id: doc.id, ...doc.data() } as Course;
    });

    const userEnrolledCourses = enrolledCourses.map(enrolled => {
        const courseDetails = coursesData[enrolled.courseId];
        return {
            ...enrolled,
            ...courseDetails
        }
    });
    
    return userEnrolledCourses as (Course & EnrolledCourseType)[];
}

export default async function DashboardPage() {
    const userEnrolledCourses = await getUserEnrolledCourses(user.id);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Welcome back, {user.name}!</h1>
      <p className="text-muted-foreground mb-8">Let's continue your learning journey.</p>

      <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold font-headline mb-4">My Courses</h2>
            {userEnrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userEnrolledCourses.map((course) => (
                        <EnrolledCourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <p>You are not enrolled in any courses yet.</p>
            )}
        </div>
      </div>
    </div>
  );
}
