"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createNote, type CreateNoteState } from "./actions";

const initialState: CreateNoteState = {};

type ToolbarItem = {
  label: string;
  command: string;
  ariaLabel: string;
  active?: string;
  activeArgs?: Record<string, unknown>;
  args?: Record<string, unknown>;
};

const toolbarItems: ToolbarItem[] = [
  { label: "B", command: "toggleBold", active: "bold", ariaLabel: "Toggle bold" },
  { label: "I", command: "toggleItalic", active: "italic", ariaLabel: "Toggle italic" },
  { label: "U", command: "toggleUnderline", active: "underline", ariaLabel: "Toggle underline" },
  { label: "H1", command: "toggleHeading", args: { level: 1 }, active: "heading", activeArgs: { level: 1 }, ariaLabel: "Toggle heading 1" },
  { label: "H2", command: "toggleHeading", args: { level: 2 }, active: "heading", activeArgs: { level: 2 }, ariaLabel: "Toggle heading 2" },
  { label: "H3", command: "toggleHeading", args: { level: 3 }, active: "heading", activeArgs: { level: 3 }, ariaLabel: "Toggle heading 3" },
  { label: "</>", command: "toggleCodeBlock", active: "codeBlock", ariaLabel: "Toggle code block" },
  { label: "—", command: "setHorizontalRule", ariaLabel: "Insert horizontal rule" },
];

export default function TiptapEditor() {
  const [contentJson, setContentJson] = useState("");
  const [state, formAction, isPending] = useActionState(createNote, initialState);

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } })],
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      setContentJson(JSON.stringify(editor.getJSON()));
    },
  });

  function runCommand(command: string, args?: Record<string, unknown>) {
    if (!editor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chain = editor.chain().focus() as any;
    if (args) {
      chain[command](args).run();
    } else {
      chain[command]().run();
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          &larr; Back to notes
        </Link>
        <button
          type="submit"
          form="new-note-form"
          disabled={isPending}
          className="h-8 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>

      <div
        className="mt-6 flex items-center gap-1 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-3 py-2"
        role="toolbar"
        aria-label="Text formatting"
      >
        {toolbarItems.map((item) => {
          const isActive = item.active && editor
            ? item.activeArgs
              ? editor.isActive(item.active, item.activeArgs)
              : editor.isActive(item.active)
            : false;

          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.ariaLabel}
              aria-pressed={item.active ? isActive : undefined}
              onClick={() => runCommand(item.command, item.args)}
              className={`h-7 px-2 rounded text-xs font-mono flex items-center cursor-pointer transition-colors ${
                isActive
                  ? "bg-foreground/10 text-foreground/80"
                  : "text-foreground/40 hover:bg-foreground/5"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-[60vh] rounded-xl border border-foreground/10 p-6">
        <EditorContent editor={editor} />
      </div>

      <form id="new-note-form" action={formAction}>
        <input type="hidden" name="content" value={contentJson} />
      </form>

      {state.error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {state.error}
        </p>
      )}
    </>
  );
}
