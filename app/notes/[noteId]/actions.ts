'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getNoteById } from '@/lib/notes';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteNote(noteId: string): Promise<{ error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Not authenticated.' };
  }

  const note = getNoteById(noteId);

  if (!note || note.userId !== session.user.id) {
    return { error: 'Note not found.' };
  }

  db.run('DELETE FROM notes WHERE id = ? AND userId = ?', [noteId, session.user.id]);

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function toggleNotePublic(
  noteId: string,
): Promise<{ error?: string; isPublic?: boolean }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Not authenticated.' };
  }

  const note = getNoteById(noteId);

  if (!note || note.userId !== session.user.id) {
    return { error: 'Note not found.' };
  }

  const newValue = note.isPublic ? 0 : 1;

  db.run('UPDATE notes SET isPublic = ?, updatedAt = unixepoch() WHERE id = ?', [newValue, noteId]);

  revalidatePath(`/notes/${noteId}`);
  revalidatePath('/dashboard');

  return { isPublic: newValue === 1 };
}
