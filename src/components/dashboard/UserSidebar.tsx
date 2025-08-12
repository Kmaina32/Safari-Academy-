'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { BookCopy, User, Settings, ShieldCheck } from 'lucide-react';

const menuItems = [
    { href: '/dashboard', label: 'My Courses', icon: BookCopy },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/admin', label: 'Admin Panel', icon: ShieldCheck },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block w-64 sticky top-16 h-[calc(100vh-4rem)]">
        <Sidebar className="h-full border-r">
        <SidebarContent className="p-4 flex flex-col justify-between">
            <SidebarMenu>
            {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                    href={item.href}
                    isActive={pathname === item.href}
                >
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.label}</span>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarContent>
        </Sidebar>
    </div>
  );
}
