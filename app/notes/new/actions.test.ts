import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks (vi.hoisted runs before vi.mock factories) ---

const { mockRun, mockGetSession, mockRedirect, mockRevalidatePath } = vi.hoisted(() => ({
  mockRun: vi.fn(),
  mockGetSession: vi.fn(),
  mockRedirect: vi.fn(),
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

vi.mock('@/lib/notes', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/notes')>();
  return { ...actual };
});

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

import { createNote } from './actions';

// --- Helpers ---

function validDoc(text = 'Hello') {
  return JSON.stringify({
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  });
}

function formDataWith(content: string): FormData {
  const fd = new FormData();
  fd.set('content', content);
  return fd;
}

// --- Tests ---

describe('createNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /auth when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);
    await createNote({}, formDataWith(validDoc()));
    expect(mockRedirect).toHaveBeenCalledWith('/auth');
  });

  it('returns error for empty content', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const result = await createNote({}, formDataWith(''));
    expect(result.error).toBe('Note content cannot be empty.');
  });

  it('returns error for whitespace-only content', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const result = await createNote({}, formDataWith('   '));
    expect(result.error).toBe('Note content cannot be empty.');
  });

  it('returns error for invalid JSON', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const result = await createNote({}, formDataWith('not json'));
    expect(result.error).toBe('Invalid note content.');
  });

  it('returns error for empty TipTap doc', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const emptyDoc = JSON.stringify({
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }],
    });
    const result = await createNote({}, formDataWith(emptyDoc));
    expect(result.error).toBe('Note content cannot be empty.');
  });

  it('inserts note and redirects on success', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    const content = validDoc();
    await createNote({}, formDataWith(content));

    expect(mockRun).toHaveBeenCalledWith(
      'INSERT INTO notes (id, userId, content) VALUES (?, ?, ?)',
      expect.arrayContaining(['u1', content]),
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(mockRedirect).toHaveBeenCalledWith(expect.stringMatching(/^\/notes\/edit\//));
  });

  it('returns error when db insert fails', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'u1' } });
    mockRun.mockImplementationOnce(() => {
      throw new Error('DB error');
    });
    const result = await createNote({}, formDataWith(validDoc()));
    expect(result.error).toBe('Failed to create note. Please try again.');
  });
});
