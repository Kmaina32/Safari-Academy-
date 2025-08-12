import { EnrolledCourseCard } from "@/components/dashboard/EnrolledCourseCard";
import { courses, enrolledCourses, user } from "@/lib/mock-data";

export default function DashboardPage() {
    const userEnrolledCourses = enrolledCourses.map(enrolled => {
        const courseDetails = courses.find(c => c.id === enrolled.courseId);
        return {
            ...enrolled,
            ...courseDetails
        }
    })

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Welcome back, {user.name}!</h1>
      <p className="text-muted-foreground mb-8">Let's continue your learning journey.</p>

      <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold font-headline mb-4">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEnrolledCourses.map((course) => (
                    // @ts-ignore
                    <EnrolledCourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
