
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CourseCard } from '@/components/courses/CourseCard';
import Link from 'next/link';
import { collection, getDocs, limit, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from '@/lib/types';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';


export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState({
    heroTitle: "Unlock Your Potential with Safari Academy",
    heroSubtitle: "Explore a world of knowledge with our expert-led courses. Start your learning journey today and achieve your goals.",
    heroImageUrl: "https://placehold.co/1200x600",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getHomepageData() {
      try {
        // Fetch settings
        const settingsDocRef = doc(db, "settings", "homepage");
        const settingsDocSnap = await getDoc(settingsDocRef);
        if (settingsDocSnap.exists()) {
          setSettings(settingsDocSnap.data() as any);
        }

        // Fetch courses
        const coursesQuery = query(collection(db, "courses"), limit(3));
        const coursesQuerySnapshot = await getDocs(coursesQuery);
        const courses: Course[] = [];
        coursesQuerySnapshot.forEach((doc) => {
          courses.push({ id: doc.id, ...doc.data() } as Course);
        });
        setFeaturedCourses(courses);

      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    }

    getHomepageData();
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="container mx-auto px-4 pt-8">
        <div className="relative rounded-lg overflow-hidden pt-16 md:pt-24 pb-16 md:pb-24">
         <div className="absolute inset-0 z-0">
             <Image 
                src={settings.heroImageUrl}
                alt="Hero background"
                fill
                className="object-cover"
                data-ai-hint="inspiring learning environment"
            />
            <div className="absolute inset-0 bg-black/50" />
         </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-white mb-6">
              {loading ? <Skeleton className="h-16 w-3/4 mx-auto" /> : settings.heroTitle}
            </h1>
            <div className="text-lg md:text-xl text-slate-200 mb-8">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full mx-auto" />
                  <Skeleton className="h-5 w-2/3 mx-auto" />
                </div>
              ) : <p>{settings.heroSubtitle}</p>}
            </div>
            <Button size="lg" asChild>
              <Link href="/courses">
                Browse Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
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
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {featuredCourses.length === 0 && (
              <div className="text-center text-muted-foreground">
                <p>No featured courses found. Add some in the admin panel!</p>
              </div>
            )}
          </>
        )}
        <div className="text-center mt-12">
            <Button variant="outline" asChild>
                <Link href="/courses">View All Courses</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
