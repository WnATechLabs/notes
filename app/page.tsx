import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-20">
      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
        <svg
          width="64"
          height="64"
          viewBox="0 0 7 5"
          aria-label="Notes app logo"
          className="select-none"
        >
          <rect x="0" y="0" width="1" height="2" fill="currentColor" />
          <rect x="6" y="0" width="1" height="2" fill="currentColor" />
          <rect x="1" y="0" width="5" height="3" fill="currentColor" />
          <rect x="2" y="1" width="1" height="1" fill="var(--background)" />
          <rect x="4" y="1" width="1" height="1" fill="var(--background)" />
          <rect x="1" y="3" width="2" height="1" fill="currentColor" />
          <rect x="4" y="3" width="2" height="1" fill="currentColor" />
        </svg>
      </div>

      <h1 className="mt-6 text-5xl font-bold tracking-tight">Notes</h1>
      <p className="mt-3 max-w-md text-center text-lg text-foreground/50">
        A fast, minimalistic place to capture your thoughts. Rich text editing,
        instant save, and one-click sharing.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/auth"
          className="h-11 px-6 rounded-lg bg-foreground text-background flex items-center font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
        <Link
          href="/dashboard"
          className="h-11 px-6 rounded-lg border border-foreground/15 flex items-center font-medium text-sm text-foreground/70 hover:border-foreground/30 transition-colors"
        >
          View Demo
        </Link>
      </div>

      <section className="mt-20 w-full max-w-3xl">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Rich Text",
              desc: "Headings, bold, italic, code blocks — powered by TipTap.",
            },
            {
              title: "Instant Save",
              desc: "Auto-saves as you type. Never lose a thought again.",
            },
            {
              title: "Share Publicly",
              desc: "One click to create a shareable link for any note.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-foreground/10 p-5"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-foreground/50">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-20 text-sm text-foreground/25">
        Built with Next.js, SQLite & TipTap
      </footer>
    </div>
  );
}
