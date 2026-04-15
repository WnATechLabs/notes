"use client";

import { useRef, useTransition } from "react";
import { deleteNote } from "./actions";

export default function DeleteNote({ noteId }: { noteId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-lg border border-red-400/40 px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto rounded-xl border border-foreground/10 bg-background p-6 text-foreground backdrop:bg-black/50"
      >
        <h2 className="text-lg font-semibold">Delete this note?</h2>
        <p className="mt-2 text-sm text-foreground/60">
          This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg border border-foreground/10 px-4 py-1.5 text-sm font-medium hover:bg-foreground/5 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await deleteNote(noteId);
              })
            }
            className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}
