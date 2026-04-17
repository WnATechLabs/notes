'use client';

import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';

export function UserMenu({ name }: { name: string }) {
  const router = useRouter();
  const popoverId = useId();
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        },
      },
    });
  }

  return (
    <>
      <button
        type='button'
        popoverTarget={popoverId}
        aria-label='Open account menu'
        className='flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer'
      >
        {initial}
      </button>
      <div
        id={popoverId}
        popover='auto'
        className='fixed inset-auto top-14 right-2 sm:right-4 m-0 min-w-[10rem] rounded-lg border border-foreground/10 bg-background p-1 shadow-lg'
      >
        <button
          type='button'
          onClick={handleSignOut}
          className='flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-foreground/80 hover:bg-foreground/5 cursor-pointer'
        >
          Sign out
        </button>
      </div>
    </>
  );
}
