
'use client';
import { CourseCard } from '@/components/courses/CourseCard';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from '@/lib/types';
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch courses that are "Published"
    const q = query(collection(db, "courses"), where("status", "==", "Published"));
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const coursesData: Course[] = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() } as Course);
        });
        setCourses(coursesData);
        setLoading(false);
        setError(null);
      }, 
      (err) => {
        console.error("Error fetching courses:", err);
        setError("Could not fetch courses. Please ensure Firestore permissions are set up correctly.");
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
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
