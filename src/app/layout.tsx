
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';

// export const metadata: Metadata = {
//   title: 'Safari Academy',
//   description: 'A comprehensive e-learning platform for hosting and accessing online courses.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const noFooterPages = ['/login', '/signup', '/forgot-password'];
  const hideFooter = isAdminPage || noFooterPages.includes(pathname);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Safari Academy</title>
        <meta name="description" content="A comprehensive e-learning platform for hosting and accessing online courses." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-24">{children}</main>
            {!hideFooter && <Footer />}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
