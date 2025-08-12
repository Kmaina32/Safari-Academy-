import { SidebarProvider } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/dashboard/UserSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
            <UserSidebar />
            <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
