import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <AdminSidebar />
        <div className="flex flex-col flex-1 pl-0 md:pl-[var(--sidebar-width-icon)] group-data-[state=expanded]:md:pl-[var(--sidebar-width)] transition-all">
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
