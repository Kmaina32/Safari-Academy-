
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc, addDoc, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Certificate, CertificateSettings, User, Course } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Award, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificateTemplate } from '@/components/shared/CertificateTemplate';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// --- Mock Data Seeding Function ---
// This function will run once to create a sample certificate.
// You can remove this function after you've seen the example.
async function seedMockCertificate(toast: (options: any) => void) {
    // 1. Get a sample user
    const usersQuery = query(collection(db, "users"), limit(1));
    const usersSnapshot = await getDocs(usersQuery);
    if (usersSnapshot.empty) {
        console.log("Seeding failed: No users found in the database.");
        return;
    }
    const sampleUser = { id: usersSnapshot.docs[0].id, ...usersSnapshot.docs[0].data() } as User;

    // 2. Get a sample course
    const coursesQuery = query(collection(db, "courses"), limit(1));
    const coursesSnapshot = await getDocs(coursesQuery);
     if (coursesSnapshot.empty) {
        console.log("Seeding failed: No courses found in the database.");
        return;
    }
    const sampleCourse = { id: coursesSnapshot.docs[0].id, ...coursesSnapshot.docs[0].data() } as Course;
    
    // 3. Check if this certificate already exists
    const existingCertQuery = query(
        collection(db, "certificates"),
        where("userId", "==", sampleUser.id),
        where("courseId", "==", sampleCourse.id)
    );
    const existingCertSnapshot = await getDocs(existingCertQuery);
    if (!existingCertSnapshot.empty) {
        console.log("Mock certificate already exists for this user and course.");
        return;
    }

    // 4. Create the certificate
    try {
        await addDoc(collection(db, "certificates"), {
            userId: sampleUser.id,
            userName: sampleUser.name,
            courseId: sampleCourse.id,
            courseTitle: sampleCourse.title,
            issuedAt: serverTimestamp(),
        });
        toast({
            title: "Mock Certificate Seeded",
            description: `A sample certificate for ${sampleCourse.title} was created for user ${sampleUser.name}.`,
        });
    } catch (error) {
        console.error("Error seeding mock certificate:", error);
    }
}


function CertificatePageSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="aspect-[11/8.5] w-full max-w-4xl" />
        </div>
    );
}

export default function StudentCertificatesPage() {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [settings, setSettings] = useState<CertificateSettings | null>(null);
    const [loading, setLoading] = useState(true);

    // This useEffect will run the seeding function once on component mount.
    useEffect(() => {
        // You can comment out or remove this line after the first run.
        seedMockCertificate(toast);
    }, [toast]);

    useEffect(() => {
        if (!user && !authLoading) {
            setLoading(false);
            return;
        }

        const fetchSettings = async () => {
             try {
                const docRef = doc(db, "settings", "certificate");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as CertificateSettings);
                }
             } catch (error) {
                 console.error("Error fetching cert settings:", error);
             }
        }
        fetchSettings();

        if (user) {
            const q = query(collection(db, "certificates"), where("userId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const certsData: Certificate[] = [];
                querySnapshot.forEach((doc) => {
                    certsData.push({ id: doc.id, ...doc.data() } as Certificate);
                });
                setCertificates(certsData);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching certificates:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user, authLoading]);

    if (loading || authLoading) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-6">My Certificates</h1>
                <CertificatePageSkeleton />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">My Certificates</h1>

            {certificates.length === 0 ? (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">You haven't earned any certificates yet.</h3>
                    <p className="text-muted-foreground mt-2">Complete your courses to earn certificates of completion.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {certificates.map(cert => (
                        <div key={cert.id}>
                           <CertificateTemplate certificate={cert} settings={settings || {signatureUrl: '', sealUrl: ''}} />
                           <div className="text-center mt-4">
                                <Button disabled>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download as PDF (Coming Soon)
                                </Button>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
