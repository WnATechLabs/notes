import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockRun, mockGetSession, mockGetNoteById, mockRedirect, mockRevalidatePath } = vi.hoisted(
  () => ({
    mockRun: vi.fn(),
    mockGetSession: vi.fn(),
    mockGetNoteById: vi.fn(),
    mockRedirect: vi.fn(),
    mockRevalidatePath: vi.fn(),
  }),
);

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn(() => ({ get: vi.fn(), all: vi.fn(() => []) })),
    run: mockRun,
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: { api: { getSession: mockGetSession } },
}));

vi.mock('@/lib/notes', () => ({
  getNoteById: mockGetNoteById,
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

import { deleteNote, toggleNotePublic } from './actions';

describe('deleteNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);
    const result = await deleteNote('n1');
    expect(result.error).toBe('Not authenticated.');
  });

  it('returns error when note not found', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue(null);
    const result = await deleteNote('n1');
    expect(result.error).toBe('Note not found.');
  });

  it('returns error when user does not own the note', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue({ id: 'n1', userId: 'other-user' });
    const result = await deleteNote('n1');
    expect(result.error).toBe('Note not found.');
  });

  it('deletes the note and redirects to dashboard', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue({ id: 'n1', userId: 'u1' });

    await deleteNote('n1');

    expect(mockRun).toHaveBeenCalledWith('DELETE FROM notes WHERE id = ? AND userId = ?', [
      'n1',
      'u1',
    ]);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });
});

describe('toggleNotePublic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);
    const result = await toggleNotePublic('n1');
    expect(result.error).toBe('Not authenticated.');
  });

  it('returns error when note not found', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue(null);
    const result = await toggleNotePublic('n1');
    expect(result.error).toBe('Note not found.');
  });

  it('toggles private note to public', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue({ id: 'n1', userId: 'u1', isPublic: 0 });

    const result = await toggleNotePublic('n1');

    expect(mockRun).toHaveBeenCalledWith(
      'UPDATE notes SET isPublic = ?, updatedAt = unixepoch() WHERE id = ?',
      [1, 'n1'],
    );
    expect(result.isPublic).toBe(true);
  });

  it('toggles public note to private', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue({ id: 'n1', userId: 'u1', isPublic: 1 });

    const result = await toggleNotePublic('n1');

    expect(mockRun).toHaveBeenCalledWith(
      'UPDATE notes SET isPublic = ?, updatedAt = unixepoch() WHERE id = ?',
      [0, 'n1'],
    );
    expect(result.isPublic).toBe(false);
  });
});
