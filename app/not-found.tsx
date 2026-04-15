import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-6xl font-bold text-foreground/20">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-3 text-foreground/50">
          The page you&apos;re looking for doesn&apos;t exist or is not
          available.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
        >
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
