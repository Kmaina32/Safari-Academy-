
'use client';
import { CourseCard } from '@/components/courses/CourseCard';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

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
    // Propagate the error to be caught by the component
    throw error;
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      } catch (err: any) {
        setError("Could not fetch courses. Please ensure Firestore permissions are set up correctly.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Courses</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Find the perfect course to expand your knowledge and skills.
        </p>
      </div>
      
      {loading && (
        <div className="text-center text-muted-foreground mt-8">
          <p>Loading courses...</p>
        </div>
      )}

      {error && (
         <Alert variant="destructive" className="max-w-2xl mx-auto">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Courses</AlertTitle>
          <AlertDescription>
            {error} Please check your Firebase console for permission errors.
          </AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <>
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
        </>
      )}
    </div>
  );
}
