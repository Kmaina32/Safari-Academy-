import { Logo } from '@/components/shared/Logo';
import { Button } from '../ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 text-muted-foreground max-w-md">
              Empowering the next generation of learners through accessible and engaging online education.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-semibold">Platform</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/courses" className="text-muted-foreground hover:text-foreground">Courses</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} Safari Academy. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="GitHub"><Github className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
