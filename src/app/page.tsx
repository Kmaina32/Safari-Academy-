
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CourseCard } from '@/components/courses/CourseCard';
import Link from 'next/link';
import { collection, getDocs, limit, query, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from '@/lib/types';
import Image from 'next/image';

async function getFeaturedCourses(): Promise<Course[]> {
  try {
    const q = query(collection(db, "courses"), limit(3));
    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() } as Course);
    });
    return courses;
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    return []; // Return an empty array on error
  }
}

async function getHomepageSettings() {
  try {
    const docRef = doc(db, "settings", "homepage");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
  }
  // Return default settings on error or if not found
  return {
      heroTitle: "Unlock Your Potential with Safari Academy",
      heroSubtitle: "Explore a world of knowledge with our expert-led courses. Start your learning journey today and achieve your goals.",
      heroImageUrl: "https://placehold.co/1200x600",
  };
}

export default async function Home() {
  const featuredCourses = await getFeaturedCourses();
  const settings = await getHomepageSettings();

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative pt-16 md:pt-24 pb-16 md:pb-24">
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
              {settings.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8">
              {settings.heroSubtitle}
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
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {featuredCourses.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>No featured courses found. Add some in the admin panel!</p>
          </div>
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
