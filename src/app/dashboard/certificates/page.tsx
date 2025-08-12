
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Certificate } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

function CertificateCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-grow">
                <Skeleton className="h-4 w-1/3" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}


const CertificateCard = ({ certificate }: { certificate: Certificate }) => {
    const issueDate = new Date(certificate.issuedAt.seconds * 1000);
    
    // The download functionality is a placeholder for a future feature
    // where a PDF could be generated.
    const handleDownload = () => {
        alert(`Downloading certificate for ${certificate.courseTitle}... (Feature coming soon)`);
    };

    return (
        <Card className="flex flex-col bg-gradient-to-br from-secondary to-background border-accent/20 shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Award className="h-12 w-12 text-accent" />
                    <div>
                        <CardTitle className="text-xl font-bold font-headline">{certificate.courseTitle}</CardTitle>
                        <CardDescription>Certificate of Completion</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Issued to: <strong>{certificate.userName}</strong></p>
                <p className="text-sm text-muted-foreground">On: {format(issueDate, 'MMMM d, yyyy')}</p>
            </CardContent>
            <CardFooter>
                <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function StudentCertificatesPage() {
    const { user, loading: authLoading } = useAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            if (!authLoading) setLoading(false);
            return;
        }

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
    }, [user, authLoading]);

    if (loading || authLoading) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-6">My Certificates</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CertificateCardSkeleton />
                    <CertificateCardSkeleton />
                    <CertificateCardSkeleton />
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map(cert => (
                        <CertificateCard key={cert.id} certificate={cert} />
                    ))}
                </div>
            )}
        </div>
    );
}
