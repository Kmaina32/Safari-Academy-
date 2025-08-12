
import { Logo } from '@/components/shared/Logo';
import { Button } from '../ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} Safari Academy. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="GitHub"><Github className="h-4 w-4" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
