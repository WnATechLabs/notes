import db from '@/lib/db';

interface NoteRow {
  id: string;
  userId: string;
  content: string;
  isPublic: number;
  createdAt: number;
  updatedAt: number;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
}

export function getUserById(userId: string): UserRow | null {
  return db.query('SELECT id, name, email FROM user WHERE id = ?').get(userId) as UserRow | null;
}

export function getNoteById(noteId: string): NoteRow | null {
  return db.query('SELECT * FROM notes WHERE id = ?').get(noteId) as NoteRow | null;
}

export function getNotesByUserId(userId: string): NoteRow[] {
  return db
    .query('SELECT * FROM notes WHERE userId = ? ORDER BY updatedAt DESC')
    .all(userId) as NoteRow[];
}

/**
 * Extract a plain-text title from TipTap JSON content.
 * Uses the first non-empty text node, falling back to "Untitled".
 */
export function extractTitle(content: string): string {
  try {
    const doc = JSON.parse(content);
    if (doc.content) {
      for (const node of doc.content) {
        const text = extractTextFromNode(node).trim();
        if (text) return text.length > 60 ? text.slice(0, 60) + '...' : text;
      }
    }
  } catch {
    // not valid JSON — treat raw string as title
    const trimmed = content.trim();
    if (trimmed) return trimmed.length > 60 ? trimmed.slice(0, 60) + '...' : trimmed;
  }
  return 'Untitled';
}

/**
 * Extract a preview (second paragraph or remaining text) from TipTap JSON.
 */
export function extractPreview(content: string): string {
  try {
    const doc = JSON.parse(content);
    if (doc.content) {
      let foundFirst = false;
      for (const node of doc.content) {
        const text = extractTextFromNode(node).trim();
        if (!text) continue;
        if (!foundFirst) {
          foundFirst = true;
          continue;
        }
        return text.length > 120 ? text.slice(0, 120) + '...' : text;
      }
    }
  } catch {
    // no preview for non-JSON
  }
  return '';
}

function extractTextFromNode(node: Record<string, unknown>): string {
  if (node.type === 'text' && typeof node.text === 'string') return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map((n: Record<string, unknown>) => extractTextFromNode(n)).join('');
  }
  return '';
}
