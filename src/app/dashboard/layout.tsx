import { SidebarProvider } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/dashboard/UserSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <UserSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
