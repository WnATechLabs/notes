import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className='sticky top-0 z-10 flex h-14 items-center justify-between border-b border-foreground/10 bg-background/80 px-4 backdrop-blur sm:px-6'>
      <Link href='/' className='text-base font-semibold tracking-tight'>
        Notes
      </Link>
      <ThemeToggle />
    </header>
  );
}
