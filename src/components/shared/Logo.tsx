import Link from 'next/link';
import { BookOpenCheck } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Safari Academy Home">
      <BookOpenCheck className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tighter text-foreground">
        Safari Academy
      </span>
    </Link>
  );
}
