"use client";

import { useTransition, useOptimistic } from "react";
import { toggleNotePublic } from "./actions";

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
      className="rounded-lg border border-foreground/10 px-4 py-1.5 text-sm font-medium hover:bg-foreground/5 transition-colors disabled:opacity-50"
    >
      {optimisticPublic ? "Public" : "Private"}
    </button>
  );
}
