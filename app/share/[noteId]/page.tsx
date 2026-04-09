import Link from "next/link";

export default function ShareNotePage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between text-sm text-foreground/40">
          <Link
            href="/"
            className="hover:text-foreground/70 transition-colors"
          >
            &larr; Home
          </Link>
          <span>Shared note</span>
        </div>

        <article className="mt-8 rounded-xl border border-foreground/10 p-8">
          <h1 className="text-3xl font-bold">Project Ideas</h1>
          <p className="mt-2 text-sm text-foreground/40">
            Shared by <span className="text-foreground/60">William</span> &middot; Apr 7, 2026
          </p>

          <div className="mt-6 space-y-4 text-foreground/70 leading-relaxed">
            <p>
              This is a preview of what a publicly shared note will look like.
              The content below is rendered read-only from the TipTap JSON
              stored in the database.
            </p>
            <h2 className="text-xl font-semibold text-foreground/80">
              Idea #1: AI-Powered Note Taking
            </h2>
            <p>
              Build a minimalistic note-taking app that uses AI to help organize
              and summarize your thoughts. Focus on speed, simplicity, and a
              beautiful writing experience.
            </p>
            <div className="rounded-lg bg-foreground/[0.03] border border-foreground/10 p-4 font-mono text-sm">
              <span className="text-foreground/30">// example code block</span>
              <br />
              const note = await db.getNote(noteId);
            </div>
            <p>
              The app should feel native and fast — no loading spinners, no
              unnecessary complexity. Just you and your words.
            </p>
          </div>
        </article>

        <p className="mt-6 text-center text-sm text-foreground/30">
          Built with Next.js, SQLite & TipTap
        </p>
      </div>
    </div>
  );
}
