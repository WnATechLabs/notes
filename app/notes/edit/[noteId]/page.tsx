import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getNoteById } from "@/lib/notes";
import TiptapEditor from "../../tiptap-editor";

export default async function NoteEditPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const { noteId } = await params;
  const note = getNoteById(noteId);

  if (!note || note.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <TiptapEditor mode="edit" noteId={note.id} initialContent={note.content} />
      </div>
    </div>
  );
}
