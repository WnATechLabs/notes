'use client';

import { useTransition, useOptimistic } from 'react';
import { toggleNotePublic } from './actions';

export default function TogglePublic({ noteId, isPublic }: { noteId: string; isPublic: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticPublic, setOptimisticPublic] = useOptimistic(isPublic);

  function handleToggle() {
    startTransition(async () => {
      setOptimisticPublic(!optimisticPublic);
      await toggleNotePublic(noteId);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        optimisticPublic
          ? 'border-green-400/40 text-green-500 hover:bg-green-500/10'
          : 'border-foreground/40 text-foreground hover:bg-foreground/10'
      }`}
    >
      {optimisticPublic ? 'Public' : 'Private'}
    </button>
  );
}
