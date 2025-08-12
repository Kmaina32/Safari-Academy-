
'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 p-4 sm:p-6">{children}</main>
      {!isAdminPage && <Footer />}
    </div>
  );
}
