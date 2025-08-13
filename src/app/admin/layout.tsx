
'use client';

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/Logo';
import {
  Home,
  BookOpen,
  Users,
  HelpCircle,
  BarChart3,
  MessageSquare,
  Settings,
  Wrench,
  PanelLeft,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { AppLoader } from '@/components/shared/AppLoader';
import { useRouter } from 'next/navigation';

function AdminNavLinks() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const links = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: '/admin/courses',
      label: 'Courses',
      icon: BookOpen,
      subLinks: [
        { href: '/admin/courses', label: 'All Courses' },
        { href: '/admin/courses/new', label: 'New Course' },
        { href: '/admin/courses/generate', label: 'Generate with AI' },
      ],
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users,
    },
    {
      href: '/admin/quizzes',
      label: 'Quizzes',
      icon: HelpCircle,
    },
    {
      href: '/admin/grading',
      label: 'Grading',
      icon: GraduationCap,
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      href: '/admin/discussions',
      label: 'Discussions',
      icon: MessageSquare,
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      href: '/admin/maintenance',
      label: 'Maintenance',
      icon: Wrench,
    },
  ];

  const isActive = (href: string, isSub: boolean = false) => {
    if (isSub) {
      return pathname === href;
    }
    return pathname.startsWith(href) && (pathname === href || href !== '/admin');
  };

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          {link.subLinks ? (
            <>
              <SidebarMenuButton
                asChild
                isActive={isActive(link.href)}
                className="justify-between"
              >
                <Link href={link.href}>
                  <div className="flex items-center gap-2">
                    <link.icon />
                    <span>{link.label}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
              {state === 'expanded' && (
                <SidebarMenuSub>
                  {link.subLinks.map((subLink) => (
                    <SidebarMenuSubItem key={subLink.href}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(subLink.href, true)}
                      >
                        <Link href={subLink.href}>{subLink.label}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </>
          ) : (
            <SidebarMenuButton asChild isActive={isActive(link.href)}>
              <Link href={link.href}>
                <link.icon />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <AppLoader />;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" side="left">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <AdminNavLinks />
        </SidebarContent>
        <SidebarFooter>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>View Site</span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="md:hidden">
            <SidebarTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </SidebarTrigger>
          </div>
          <div className="flex-1">
            {/* You can add breadcrumbs or page titles here */}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
