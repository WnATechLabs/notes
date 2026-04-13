import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getNotesByUserId, extractTitle, extractPreview } from "@/lib/notes";
import LogoutButton from "./logout-button";

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const notes = getNotesByUserId(session.user.id);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Notes</h1>
            <p className="mt-1 text-foreground/60">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>
          <Link
            href="/notes/new"
            className="h-10 px-4 rounded-lg bg-foreground text-background flex items-center gap-2 font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <span className="text-lg leading-none">+</span> New Note
          </Link>
        </div>

        {notes.length === 0 ? (
          <div className="mt-16 text-center text-foreground/40">
            <p className="text-lg">No notes yet</p>
            <p className="mt-1 text-sm">
              Create your first note to get started.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group rounded-xl border border-foreground/10 p-5 hover:border-foreground/25 hover:bg-foreground/[0.02] transition-all"
              >
                <h2 className="font-semibold group-hover:underline">
                  {extractTitle(note.content)}
                </h2>
                <p className="mt-2 text-sm text-foreground/50 line-clamp-2">
                  {extractPreview(note.content)}
                </p>
                <p className="mt-3 text-xs text-foreground/35">
                  {formatDate(note.updatedAt)}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            &larr; Back to home
          </Link>
          <span className="text-foreground/20">|</span>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
