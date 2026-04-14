"use client";

import { useRef, useCallback, useState } from "react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { updateNote, type UpdateNoteState } from "./actions";

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

const AUTOSAVE_DELAY = 1500;

export default function TiptapEditor({
  noteId,
  initialContent,
}: {
  noteId: string;
  initialContent: string;
}) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string>();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const debouncedSave = useCallback(
    (content: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        setSaveStatus("saving");
        setError(undefined);
        const result: UpdateNoteState = await updateNote(noteId, content);
        if (result.error) {
          setSaveStatus("error");
          setError(result.error);
        } else {
          setSaveStatus("saved");
        }
      }, AUTOSAVE_DELAY);
    },
    [noteId]
  );

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } })],
    content: JSON.parse(initialContent),
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      setSaveStatus("idle");
      debouncedSave(JSON.stringify(editor.getJSON()));
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
        <span
          className={`text-xs transition-colors ${
            saveStatus === "saving"
              ? "text-foreground/40"
              : saveStatus === "saved"
                ? "text-green-500"
                : saveStatus === "error"
                  ? "text-red-500"
                  : "text-transparent"
          }`}
          aria-live="polite"
        >
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "error" && (error ?? "Save failed")}
        </span>
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
        <div className="mt-4 space-y-3">
          <div className="h-px bg-foreground/10" />
          <p className="text-foreground/25 text-sm italic">
            Auto-save enabled — your changes are saved as you type
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </>
  );
}
