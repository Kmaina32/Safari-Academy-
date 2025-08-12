
'use client';
import React from 'react';
import { EnrolledCourseCard, EnrolledCourseCardSkeleton } from "@/components/dashboard/EnrolledCourseCard";
import { useAuth } from '@/hooks/use-auth';
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course, EnrolledCourse as EnrolledCourseType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

async function getDemoCourses(): Promise<(Course & Partial<EnrolledCourseType>)[]> {
    try {
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
    } catch (error) {
        console.error("Error fetching demo courses:", error);
        return [];
    }
}

function DashboardSkeleton() {
    return (
        <div>
            <Skeleton className="h-9 w-1/2 mb-2" />
            <Skeleton className="h-5 w-1/3 mb-8" />
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-8 w-1/4 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <EnrolledCourseCardSkeleton />
                        <EnrolledCourseCardSkeleton />
                        <EnrolledCourseCardSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userEnrolledCourses, setUserEnrolledCourses] = React.useState<(Course & Partial<EnrolledCourseType>)[]>([]);
    const [coursesLoading, setCoursesLoading] = React.useState(true);

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            async function fetchCourses() {
                // Here you would fetch actual user enrollments.
                // For now, we'll just show a few demo courses.
                const courses = await getDemoCourses();
                setUserEnrolledCourses(courses);
                setCoursesLoading(false);
            }
            fetchCourses();
        }
    }, [user, loading, router]);

    if (loading || (!user && !loading)) {
        return <DashboardSkeleton />;
    }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Welcome back, {user?.displayName || 'Student'}!</h1>
      <p className="text-muted-foreground mb-8">Let's continue your learning journey.</p>

      <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold font-headline mb-4">My Courses</h2>
            {coursesLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <EnrolledCourseCardSkeleton />
                    <EnrolledCourseCardSkeleton />
                    <EnrolledCourseCardSkeleton />
                </div>
            ) : userEnrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userEnrolledCourses.map((course) => (
                        <EnrolledCourseCard key={course.id} course={course as Course & EnrolledCourseType} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">You aren't enrolled in any courses yet.</h3>
                    <p className="text-muted-foreground mt-2 mb-4">Explore our catalog and start your learning adventure!</p>
                    <Button asChild>
                        <Link href="/courses">Browse Courses</Link>
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
