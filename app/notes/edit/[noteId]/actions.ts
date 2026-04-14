"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getNoteById } from "@/lib/notes";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export type UpdateNoteState = {
  error?: string;
  savedAt?: number;
};

export async function updateNote(
  noteId: string,
  content: string
): Promise<UpdateNoteState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Not authenticated." };
  }

  if (!content || !content.trim()) {
    return { error: "Note content cannot be empty." };
  }

  try {
    JSON.parse(content);
  } catch {
    return { error: "Invalid note content." };
  }

  const note = getNoteById(noteId);

  if (!note || note.userId !== session.user.id) {
    return { error: "Note not found." };
  }

  db.run(
    "UPDATE notes SET content = ?, updatedAt = unixepoch() WHERE id = ?",
    [content, noteId]
  );

  revalidatePath("/dashboard");
  revalidatePath(`/notes/${noteId}`);

  return { savedAt: Date.now() };
}
