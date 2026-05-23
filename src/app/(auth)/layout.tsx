import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-paper">
      {/* Editorial brand panel */}
      <aside className="hidden lg:flex relative flex-col justify-between p-12 bg-ink text-paper overflow-hidden">
        {/* Decorative serif glyph */}
        <div
          aria-hidden
          className="absolute -right-24 -bottom-32 display text-[28rem] leading-none text-paper/[0.04] select-none pointer-events-none"
        >
          ¶
        </div>
        {/* Decorative hairline grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(250,247,242,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,247,242,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <Link href="/" className="relative z-10 flex items-baseline gap-2">
          <span className="display-tight text-3xl">
            Pulse<span className="text-rust">·</span>IQ
          </span>
          <span className="kicker !text-paper/60 !text-[9.5px]">v0.1 · prototype</span>
        </Link>

        <div className="relative z-10 max-w-md space-y-8 rise">
          <p className="kicker !text-paper/60 !text-[10.5px]">Customer Pulse Intelligence</p>
          <h2 className="display text-[44px] leading-[1.05] text-paper">
            Hear every customer.
            <br />
            <span className="italic text-rust-tint" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80" }}>
              Before they leave.
            </span>
          </h2>
          <p className="text-paper/70 text-[15px] leading-relaxed max-w-sm">
            PulseIQ continuously reads your customer interactions across Slack,
            Zendesk, and surveys — and turns thousands of signals into a single
            score per account.
          </p>

          {/* Faux metric strip — adds editorial credibility */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-paper/15">
            <div>
              <div className="display-num text-3xl text-paper">85<span className="text-paper/50">%</span></div>
              <div className="kicker !text-paper/60 !text-[9px] mt-1.5">Sentiment agreement vs human</div>
            </div>
            <div>
              <div className="display-num text-3xl text-paper">&lt;5<span className="text-paper/50">m</span></div>
              <div className="kicker !text-paper/60 !text-[9px] mt-1.5">Interaction to alert</div>
            </div>
            <div>
              <div className="display-num text-3xl text-paper">100<span className="text-paper/50">%</span></div>
              <div className="kicker !text-paper/60 !text-[9px] mt-1.5">Tenant data isolation</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-paper/40 mono">
          <span>© 2026 Inflectiv</span>
          <span>Built for customer-success teams</span>
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px] rise">{children}</div>
      </section>
    </div>
  );
}
