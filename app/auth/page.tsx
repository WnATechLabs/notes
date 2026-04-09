import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center">Welcome back</h1>
        <p className="mt-2 text-center text-foreground/60">
          Sign in to your account to continue
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="h-10 rounded-lg border border-foreground/20 bg-foreground/5" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="h-10 rounded-lg border border-foreground/20 bg-foreground/5" />
          </div>
          <div className="h-10 rounded-lg bg-foreground text-background flex items-center justify-center font-medium text-sm">
            Sign In
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-foreground/50">
          Don&apos;t have an account?{" "}
          <span className="underline font-medium text-foreground/80">
            Sign up
          </span>
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
