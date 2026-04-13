import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function NoteEditorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            &larr; Back to notes
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-foreground/30">Saved</span>
            <div className="h-8 px-3 rounded-lg border border-foreground/15 flex items-center text-sm text-foreground/60">
              Share
            </div>
          </div>
        </div>

        {/* Mock toolbar */}
        <div className="mt-6 flex items-center gap-1 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-3 py-2">
          {["B", "I", "U", "H1", "H2", "H3", "&lt;/&gt;", "---"].map(
            (btn) => (
              <div
                key={btn}
                className="h-7 px-2 rounded text-xs font-mono flex items-center text-foreground/40 hover:bg-foreground/5"
                dangerouslySetInnerHTML={{ __html: btn }}
              />
            )
          )}
        </div>

        {/* Mock editor area */}
        <div className="mt-4 min-h-[60vh] rounded-xl border border-foreground/10 p-6">
          <h1 className="text-2xl font-bold text-foreground/80">
            Untitled Note
          </h1>
          <div className="mt-4 space-y-3">
            <p className="text-foreground/40">
              Start typing here... The TipTap rich text editor will go here with
              support for headings, bold, italic, code blocks, and more.
            </p>
            <div className="h-px bg-foreground/10" />
            <p className="text-foreground/25 text-sm italic">
              Auto-save enabled — your changes are saved as you type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
