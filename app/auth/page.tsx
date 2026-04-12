"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSignUp = searchParams.get("mode") === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const callbacks = {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (ctx: { error: { message?: string } }) => {
        setError(ctx.error.message ?? "Something went wrong");
        setLoading(false);
      },
    };

    if (isSignUp) {
      await signUp.email({ name, email, password }, callbacks);
    } else {
      await signIn.email({ email, password }, callbacks);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-center text-foreground/60">
          {isSignUp
            ? "Sign up to start taking notes"
            : "Sign in to your account to continue"}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 text-sm outline-none focus:border-foreground/40"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 text-sm outline-none focus:border-foreground/40"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-foreground/20 bg-foreground/5 px-3 text-sm outline-none focus:border-foreground/40"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-lg bg-foreground text-background font-medium text-sm disabled:opacity-50"
          >
            {loading
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
                ? "Sign Up"
                : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/50">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <Link
            href={isSignUp ? "/auth" : "/auth?mode=signup"}
            className="underline font-medium text-foreground/80"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </Link>
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
