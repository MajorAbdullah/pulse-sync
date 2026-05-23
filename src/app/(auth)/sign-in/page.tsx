"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 350);
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="kicker">Sign in</p>
        <h1 className="display text-[34px] text-ink leading-tight">
          Welcome back to your <span className="italic text-rust">pulse</span>.
        </h1>
        <p className="text-sm text-ink-3 max-w-sm">
          Use your work email. We'll send a magic link if you'd prefer not to
          enter a password.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            defaultValue="j.merrick@pulseiq.dev"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="kicker hover:text-ink transition-colors">
              Forgot
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••"
            defaultValue="demo-password"
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
          <ArrowRight className="size-3.5" />
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-rule" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-paper kicker !text-[9.5px]">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => router.push("/dashboard")}
        >
          <KeyRound className="size-3.5" />
          Email me a magic link
        </Button>
      </form>

      <p className="text-sm text-ink-3 text-center">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="text-ink font-medium underline underline-offset-4 hover:no-underline"
        >
          Request access
        </Link>
      </p>

      <p className="mono !text-[10.5px] text-ink-4 text-center pt-4">
        prototype · all data shown is mock
      </p>
    </div>
  );
}
