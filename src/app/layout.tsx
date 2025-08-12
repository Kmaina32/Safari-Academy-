import './globals.css';
import { cn } from '@/lib/utils';
import ClientAppLayout from './ClientAppLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <ClientAppLayout>
            {children}
          </ClientAppLayout>
      </body>
    </html>
  );
}