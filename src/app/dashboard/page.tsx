import { EnrolledCourseCard } from "@/components/dashboard/EnrolledCourseCard";
import { enrolledCourses, user } from "@/lib/data";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course, EnrolledCourse as EnrolledCourseType } from '@/lib/types';

// This is a placeholder for fetching user-specific enrollments
async function getUserEnrolledCourses(userId: string): Promise<(Course & EnrolledCourseType)[]> {
    // In a real app, you'd fetch enrollment data for the user
    // For now, we'll use the mock enrollment data and fetch full course details
    const courseIds = enrolledCourses.map(e => e.courseId);
    
    if (courseIds.length === 0) {
        return [];
    }

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
