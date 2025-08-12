
'use client';

import React from 'react';
import type { Certificate, CertificateSettings } from '@/lib/types';
import { format } from 'date-fns';
import { Logo } from './Logo';
import Image from 'next/image';

interface CertificateTemplateProps {
    certificate: Certificate;
    settings: CertificateSettings;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ certificate, settings }) => {
    const issueDate = new Date(certificate.issuedAt.seconds * 1000);

    return (
        <div className="bg-white text-gray-800 rounded-lg shadow-2xl p-8 border-4 border-accent relative aspect-[11/8.5] max-w-4xl mx-auto flex flex-col justify-between font-serif">
            {/* Ornate Border */}
            <div className="absolute inset-0 border-2 border-primary m-2 rounded-md" />
            <div className="absolute inset-0 border-2 border-primary/50 m-4 rounded-md" />

            <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                    <Logo />
                </div>
                <h2 className="text-2xl font-bold tracking-wider uppercase text-muted-foreground">Certificate of Completion</h2>
            </div>
            
            <div className="relative z-10 text-center my-8">
                <p className="text-lg">This certificate is proudly presented to</p>
                <p className="text-5xl font-bold text-primary my-4 cursive">{certificate.userName}</p>
                <p className="text-lg">for successfully completing the course</p>
                <p className="text-3xl font-semibold my-2 tracking-wide">{certificate.courseTitle}</p>
                <p className="text-md text-muted-foreground">Issued on {format(issueDate, 'MMMM d, yyyy')}</p>
            </div>

            <div className="relative z-10 flex justify-between items-end mt-8">
                <div className="text-center">
                     {settings.signatureUrl ? (
                        <Image src={settings.signatureUrl} alt="Signature" width={150} height={75} className="mx-auto" data-ai-hint="signature" />
                    ) : (
                        <div className="w-[150px] h-[75px] bg-gray-200" />
                    )}
                    <div className="border-t border-gray-400 w-48 mt-2 mx-auto" />
                    <p className="text-sm">Instructor Signature</p>
                </div>
                <div className="text-center">
                     {settings.sealUrl ? (
                        <Image src={settings.sealUrl} alt="Seal" width={100} height={100} className="mx-auto" data-ai-hint="company seal" />
                     ) : (
                         <div className="w-[100px] h-[100px] bg-gray-200 rounded-full" />
                     )}
                </div>
            </div>
             <style jsx>{`
                .cursive {
                    font-family: 'Pinyon Script', cursive; /* A more elegant script font */
                }
             `}</style>
             <link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap" rel="stylesheet" />
        </div>
    );
}
