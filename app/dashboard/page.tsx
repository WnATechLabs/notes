import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import LogoutButton from "./logout-button";

const mockNotes = [
  { id: "1", title: "Project Ideas", preview: "A collection of startup ideas and side projects to explore...", date: "Apr 7" },
  { id: "2", title: "Meeting Notes", preview: "Weekly sync: discussed roadmap priorities and Q2 goals...", date: "Apr 5" },
  { id: "3", title: "Reading List", preview: "Books and articles to read: Designing Data-Intensive Apps...", date: "Apr 3" },
  { id: "4", title: "Recipe Collection", preview: "Homemade pasta dough: 2 cups flour, 3 eggs, pinch of salt...", date: "Mar 30" },
  { id: "5", title: "Travel Plans", preview: "Tokyo itinerary: Day 1 — Shibuya, Harajuku, Meiji Shrine...", date: "Mar 28" },
  { id: "6", title: "Code Snippets", preview: "Useful TypeScript utility types and helper functions...", date: "Mar 25" },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Notes</h1>
            <p className="mt-1 text-foreground/60">
              {mockNotes.length} notes
            </p>
          </div>
          <Link
            href="/notes/new"
            className="h-10 px-4 rounded-lg bg-foreground text-background flex items-center gap-2 font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <span className="text-lg leading-none">+</span> New Note
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockNotes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="group rounded-xl border border-foreground/10 p-5 hover:border-foreground/25 hover:bg-foreground/[0.02] transition-all"
            >
              <h2 className="font-semibold group-hover:underline">
                {note.title}
              </h2>
              <p className="mt-2 text-sm text-foreground/50 line-clamp-2">
                {note.preview}
              </p>
              <p className="mt-3 text-xs text-foreground/35">{note.date}</p>
            </Link>
          ))}
        </div>

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
