'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const options = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <circle cx='12' cy='12' r='4' />
        <path d='M12 2v2' />
        <path d='M12 20v2' />
        <path d='m4.93 4.93 1.41 1.41' />
        <path d='m17.66 17.66 1.41 1.41' />
        <path d='M2 12h2' />
        <path d='M20 12h2' />
        <path d='m6.34 17.66-1.41 1.41' />
        <path d='m19.07 4.93-1.41 1.41' />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <rect x='2' y='3' width='20' height='14' rx='2' />
        <path d='M8 21h8' />
        <path d='M12 17v4' />
      </svg>
    ),
  },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for theme-dependent styling
    setMounted(true);
  }, []);

  return (
    <div
      role='radiogroup'
      aria-label='Theme'
      className='inline-flex items-center rounded-lg border border-foreground/10 bg-foreground/[0.02] p-0.5'
    >
      {options.map((option) => {
        const active = mounted && theme === option.value;
        return (
          <button
            key={option.value}
            type='button'
            role='radio'
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-foreground/50 hover:text-foreground'
            }`}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
}
