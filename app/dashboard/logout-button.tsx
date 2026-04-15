'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  }

  return (
    <button
      onClick={handleLogout}
      className='text-sm text-foreground/50 hover:text-foreground/80 transition-colors cursor-pointer'
    >
      Sign out
    </button>
  );
}
