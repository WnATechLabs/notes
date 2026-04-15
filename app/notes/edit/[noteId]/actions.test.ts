import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockRun, mockGetSession, mockGetNoteById, mockRevalidatePath } = vi.hoisted(() => ({
  mockRun: vi.fn(),
  mockGetSession: vi.fn(),
  mockGetNoteById: vi.fn(),
  mockRevalidatePath: vi.fn(),
}));

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

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

import { updateNote } from './actions';

function validContent(text = 'Hello') {
  return JSON.stringify({
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  });
}

describe('updateNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);
    const result = await updateNote('n1', validContent());
    expect(result.error).toBe('Not authenticated.');
  });

  it('returns error for empty content', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const result = await updateNote('n1', '');
    expect(result.error).toBe('Note content cannot be empty.');
  });

  it('returns error for invalid JSON', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const result = await updateNote('n1', 'not json');
    expect(result.error).toBe('Invalid note content.');
  });

  it('returns error when note not found', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue(null);
    const result = await updateNote('n1', validContent());
    expect(result.error).toBe('Note not found.');
  });

  it('returns error when user does not own the note', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue({ id: 'n1', userId: 'other-user' });
    const result = await updateNote('n1', validContent());
    expect(result.error).toBe('Note not found.');
  });

  it('updates note and returns savedAt on success', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockGetNoteById.mockReturnValue({ id: 'n1', userId: 'u1' });
    const content = validContent();

    const result = await updateNote('n1', content);

    expect(mockRun).toHaveBeenCalledWith(
      'UPDATE notes SET content = ?, updatedAt = unixepoch() WHERE id = ?',
      [content, 'n1'],
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/notes/n1');
    expect(result.savedAt).toBeTypeOf('number');
  });
});
