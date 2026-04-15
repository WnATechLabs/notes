'use client';

import { useState, useCallback } from 'react';

export default function CopyLink() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  return (
    <button
      onClick={handleCopy}
      className='rounded-lg border border-foreground/40 px-4 py-1.5 text-sm font-medium text-foreground hover:bg-foreground/10 transition-colors'
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}
