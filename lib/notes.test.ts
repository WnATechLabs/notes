import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn(() => ({ get: vi.fn(), all: vi.fn(() => []) })),
    run: vi.fn(),
  },
}));

import { extractTitle, extractPreview, isEmptyDoc, formatDate } from './notes';

// --- Helper to build TipTap JSON ---

function tiptapDoc(...paragraphs: string[]) {
  return JSON.stringify({
    type: 'doc',
    content: paragraphs.map((text) => ({
      type: 'paragraph',
      content: text ? [{ type: 'text', text }] : [],
    })),
  });
}

// --- extractTitle ---

describe('extractTitle', () => {
  it('returns the first paragraph text', () => {
    expect(extractTitle(tiptapDoc('Hello World', 'body text'))).toBe('Hello World');
  });

  it('skips empty leading paragraphs', () => {
    expect(extractTitle(tiptapDoc('', 'Actual Title'))).toBe('Actual Title');
  });

  it('truncates titles longer than 60 chars', () => {
    const long = 'A'.repeat(80);
    const result = extractTitle(tiptapDoc(long));
    expect(result).toBe('A'.repeat(60) + '...');
  });

  it('returns "Untitled" for empty doc', () => {
    expect(extractTitle(tiptapDoc())).toBe('Untitled');
    expect(extractTitle(tiptapDoc(''))).toBe('Untitled');
  });

  it('falls back to raw string for non-JSON content', () => {
    expect(extractTitle('plain text note')).toBe('plain text note');
  });

  it('truncates raw string fallback at 60 chars', () => {
    const long = 'B'.repeat(80);
    expect(extractTitle(long)).toBe('B'.repeat(60) + '...');
  });

  it('returns "Untitled" for empty string', () => {
    expect(extractTitle('')).toBe('Untitled');
    expect(extractTitle('   ')).toBe('Untitled');
  });
});

// --- extractPreview ---

describe('extractPreview', () => {
  it('returns the second non-empty paragraph', () => {
    expect(extractPreview(tiptapDoc('Title', 'Preview text'))).toBe('Preview text');
  });

  it('returns empty string when only one paragraph', () => {
    expect(extractPreview(tiptapDoc('Title'))).toBe('');
  });

  it('truncates preview longer than 120 chars', () => {
    const long = 'C'.repeat(150);
    const result = extractPreview(tiptapDoc('Title', long));
    expect(result).toBe('C'.repeat(120) + '...');
  });

  it('returns empty string for non-JSON content', () => {
    expect(extractPreview('plain text')).toBe('');
  });

  it('returns empty string for empty doc', () => {
    expect(extractPreview(tiptapDoc())).toBe('');
  });
});

// --- isEmptyDoc ---

describe('isEmptyDoc', () => {
  it('returns true for doc with no content array', () => {
    expect(isEmptyDoc({ type: 'doc' })).toBe(true);
  });

  it('returns true for doc with empty content array', () => {
    expect(isEmptyDoc({ type: 'doc', content: [] })).toBe(true);
  });

  it('returns true for doc with only empty paragraphs', () => {
    expect(
      isEmptyDoc({
        type: 'doc',
        content: [
          { type: 'paragraph' },
          { type: 'paragraph', content: [] },
        ],
      }),
    ).toBe(true);
  });

  it('returns false when a paragraph has content', () => {
    expect(
      isEmptyDoc({
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
      }),
    ).toBe(false);
  });

  it('returns false for non-paragraph nodes', () => {
    expect(
      isEmptyDoc({
        type: 'doc',
        content: [{ type: 'heading', content: [{ type: 'text', text: 'Title' }] }],
      }),
    ).toBe(false);
  });
});

// --- formatDate ---

describe('formatDate', () => {
  it('formats a unix timestamp to a readable date string', () => {
    // Use a well-known timestamp and just check it returns a non-empty string
    const result = formatDate(1700000000);
    expect(result).toBeTruthy();
    expect(result).toMatch(/\w+ \d{1,2}, \d{4}/);
  });

  it('accepts custom format options', () => {
    const result = formatDate(1700000000, { month: 'short', day: 'numeric' });
    expect(result).toBeTruthy();
    // With no year option, the result should be shorter
    expect(result).not.toMatch(/\d{4}/);
  });
});
