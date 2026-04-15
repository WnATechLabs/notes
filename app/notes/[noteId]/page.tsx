import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getNoteById, getUserById, extractTitle } from '@/lib/notes';
import NoteContent from './note-content';
import TogglePublic from './toggle-public';
import DeleteNote from './delete-note';
import CopyLink from './copy-link';

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function NoteViewPage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  const note = getNoteById(noteId);

  if (!note) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isOwner = session?.user.id === note.userId;

  if (!isOwner && !note.isPublic) {
    notFound();
  }

  const author = getUserById(note.userId);
  const title = extractTitle(note.content);

  return (
    <div className='min-h-screen px-4 py-12'>
      <div className='mx-auto max-w-2xl'>
        <div className='flex items-center justify-between text-sm text-foreground/40'>
          <Link
            href={isOwner ? '/dashboard' : '/'}
            className='hover:text-foreground/70 transition-colors'
          >
            &larr; {isOwner ? 'Back to notes' : 'Home'}
          </Link>
          <div className='flex items-center gap-3'>
            {isOwner && (
              <>
                <CopyLink />
                <DeleteNote noteId={note.id} />
                <TogglePublic noteId={note.id} isPublic={!!note.isPublic} />
                <Link
                  href={`/notes/edit/${note.id}`}
                  className='rounded-lg bg-foreground text-background px-4 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity'
                >
                  Edit
                </Link>
              </>
            )}
            {!isOwner && (
              <>
                <span>Shared note</span>
                <CopyLink />
              </>
            )}
          </div>
        </div>

        <article className='mt-8 rounded-xl border border-foreground/10 p-8'>
          <h1 className='text-3xl font-bold'>{title}</h1>
          <p className='mt-2 text-sm text-foreground/40'>
            {isOwner ? (
              'By you'
            ) : (
              <>
                Shared by <span className='text-foreground/60'>{author?.name ?? 'Unknown'}</span>
              </>
            )}{' '}
            &middot; {formatDate(note.updatedAt)}
          </p>

          <NoteContent content={note.content} />
        </article>

        <p className='mt-6 text-center text-sm text-foreground/30'>
          Built with Next.js, SQLite &amp; TipTap
        </p>
      </div>
    </div>
  );
}
