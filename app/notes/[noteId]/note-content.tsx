'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

export default function NoteContent({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } }), Underline],
    content: JSON.parse(content),
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className='note-content mt-6 text-foreground/70 leading-relaxed'>
      <EditorContent editor={editor} />
    </div>
  );
}
