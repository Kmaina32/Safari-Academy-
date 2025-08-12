
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Certificate, CertificateSettings } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Award, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificateTemplate } from '@/components/shared/CertificateTemplate';
import { Button } from '@/components/ui/button';

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
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [settings, setSettings] = useState<CertificateSettings | null>(null);
    const [loading, setLoading] = useState(true);

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
