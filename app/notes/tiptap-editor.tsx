"use client";

import { useRef, useCallback, useState, useActionState } from "react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { createNote, type CreateNoteState } from "./new/actions";
import { updateNote } from "./edit/[noteId]/actions";

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

type Props =
  | { mode: "create" }
  | { mode: "edit"; noteId: string; initialContent: string };

export default function TiptapEditor(props: Props) {
  const isEdit = props.mode === "edit";

  // Create mode state
  const [contentJson, setContentJson] = useState("");
  const [createState, formAction, isPending] = useActionState(
    createNote,
    {} as CreateNoteState
  );

  // Edit mode state
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string>();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const saveVersionRef = useRef(0);

  const noteId = isEdit ? props.noteId : null;

  const debouncedSave = useCallback(
    (content: string) => {
      if (!isEdit || !noteId) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        const version = ++saveVersionRef.current;
        setSaveStatus("saving");
        setSaveError(undefined);
        const result = await updateNote(noteId, content);
        if (version !== saveVersionRef.current) return;
        if (result.error) {
          setSaveStatus("error");
          setSaveError(result.error);
        } else {
          setSaveStatus("saved");
        }
      }, AUTOSAVE_DELAY);
    },
    [isEdit, noteId]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
    ],
    content: isEdit ? JSON.parse(props.initialContent) : undefined,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      if (isEdit) {
        setSaveStatus("idle");
        debouncedSave(json);
      } else {
        setContentJson(json);
      }
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

  const error = isEdit ? saveError : createState.error;

  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          &larr; Back to notes
        </Link>

        {isEdit ? (
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
            {saveStatus === "error" && (saveError ?? "Save failed")}
          </span>
        ) : (
          <button
            type="submit"
            form="new-note-form"
            disabled={isPending}
            className="h-8 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        )}
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
        {isEdit && (
          <div className="mt-4 space-y-3">
            <div className="h-px bg-foreground/10" />
            <p className="text-foreground/25 text-sm italic">
              Auto-save enabled — your changes are saved as you type
            </p>
          </div>
        )}
      </div>

      {!isEdit && (
        <form id="new-note-form" action={formAction}>
          <input type="hidden" name="content" value={contentJson} />
        </form>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </>
  );
}
