import Link from 'next/link';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className='sticky top-0 z-10 flex h-14 items-center justify-between border-b border-foreground/10 bg-background/80 px-4 backdrop-blur sm:px-6'>
      <Link href='/' className='text-base font-semibold tracking-tight'>
        Notes
      </Link>
      <div className='flex items-center gap-3'>
        <ThemeToggle />
        {session?.user && <UserMenu name={session.user.name ?? session.user.email ?? '?'} />}
      </div>
    </header>
  );
}
