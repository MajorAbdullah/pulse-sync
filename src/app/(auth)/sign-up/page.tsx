"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const BULLETS = [
  "Real-time sentiment across Slack, Zendesk, and surveys",
  "Customer Pulse Score, recomputed continuously",
  "Churn-risk signals with AI-generated next actions",
];

export default function SignUpPage() {
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
        <p className="kicker">Request access</p>
        <h1 className="display text-[34px] text-ink leading-tight">
          Start reading your customer <span className="italic text-rust">signal</span>.
        </h1>
        <p className="text-sm text-ink-3 max-w-sm">
          PulseSync is in private pilot. Get added to your team's workspace —
          takes under a minute.
        </p>
      </header>

      <ul className="space-y-2 py-2">
        {BULLETS.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-ink-2">
            <span className="mt-1 size-3.5 rounded-full bg-sage-tint border border-sage/40 flex items-center justify-center shrink-0">
              <Check className="size-2 text-sage-deep" strokeWidth={3} />
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="first">First name</Label>
            <Input id="first" required defaultValue="Jules" />
          </div>
          <div>
            <Label htmlFor="last">Last name</Label>
            <Input id="last" required defaultValue="Merrick" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" required defaultValue="jules@inflectiv.dev" />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" required defaultValue="Inflectiv" />
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? "Provisioning workspace…" : "Request access"}
          <ArrowRight className="size-3.5" />
        </Button>
      </form>

      <p className="text-sm text-ink-3 text-center">
        Already have access?{" "}
        <Link
          href="/sign-in"
          className="text-ink font-medium underline underline-offset-4 hover:no-underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
