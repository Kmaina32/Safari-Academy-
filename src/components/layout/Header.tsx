
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlignJustify, Bell, Home, LogOut, Settings, User, Shield, LayoutDashboard, FileText } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';


const loggedOutNavLinks = [
  { href: '/courses', label: 'Courses' },
];

const loggedInNavLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/dashboard', label: 'Dashboard' },
];

const adminNavLinks = [
    { href: '/admin', label: 'Dashboard'},
    { href: '/admin/courses', label: 'Courses'},
    { href: '/admin/users', label: 'Users'},
    { href: '/admin/analytics', label: 'Analytics'},
    { href: '/admin/discussions', label: 'Discussions'},
    { href: '/admin/quizzes', label: 'Quizzes'},
    { href: '/admin/settings', label: 'Settings'},
]

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isAdminPage = pathname.startsWith('/admin');
  const isHomePage = pathname === '/';
  
  let navLinks;
  if (isAdminPage) {
    navLinks = adminNavLinks;
  } else if (user) {
    navLinks = loggedInNavLinks;
  } else {
    navLinks = loggedOutNavLinks;
  }


  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  const showNavLinks = !isHomePage || user || isAdminPage;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-8 hidden md:flex">
          <Logo />
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <AlignJustify className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle><Logo /></SheetTitle>
                    <SheetDescription>
                      Navigate through the application.
                    </SheetDescription>
                  </SheetHeader>
                    <div className="mt-8">
                        <nav className="flex flex-col gap-4">
                        {showNavLinks && navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-lg font-medium text-muted-foreground transition-colors hover:text-foreground',
                                    pathname === link.href && 'text-foreground'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>


        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {showNavLinks && navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
            {isAdminPage && (
                <Button variant="outline" size="sm" asChild>
                    <Link href="/"><Home className="mr-2 h-4 w-4"/> View Site</Link>
                </Button>
            )}
          
          {!loading && (
            user ? (
              <>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || 'https://placehold.co/100x100'} alt={user.displayName || 'User'} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!isAdminPage && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/quizzes">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Quizzes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
                !isAdminPage && (
                    <div className="space-x-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                )
            )
          )}
        </div>
      </div>
    </header>
  );
}
