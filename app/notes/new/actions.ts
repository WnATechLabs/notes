'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { isEmptyDoc } from '@/lib/notes';
import db from '@/lib/db';

export type CreateNoteState = {
  error?: string;
};

export async function createNote(
  _prev: CreateNoteState,
  formData: FormData,
): Promise<CreateNoteState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth');
  }

  const content = formData.get('content');

  if (!content || typeof content !== 'string' || !content.trim()) {
    return { error: 'Note content cannot be empty.' };
  }

  try {
    const doc = JSON.parse(content);
    if (doc.type !== 'doc' || isEmptyDoc(doc)) {
      return { error: 'Note content cannot be empty.' };
    }
  } catch {
    return { error: 'Invalid note content.' };
  }

  const id = crypto.randomUUID();

  try {
    db.run('INSERT INTO notes (id, userId, content) VALUES (?, ?, ?)', [
      id,
      session.user.id,
      content,
    ]);
  } catch (error) {
    console.error('Failed to create note:', error);
    return { error: 'Failed to create note. Please try again.' };
  }

  revalidatePath('/dashboard');
  redirect(`/notes/edit/${id}`);
}
