import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, AlertTriangle, Filter, ArrowUpDown } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { PulseScore } from "@/components/data/pulse-score";
import { Sparkline } from "@/components/data/sparkline";
import { RiskBadge } from "@/components/data/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { customers, portfolioKpis, members } from "@/lib/mock/data";
import { cn, formatNumber, formatPercent, initials, relativeTime } from "@/lib/utils";

export default function PortfolioPage() {
  const kpis = portfolioKpis();
  // Sort: highest risk first, then by pulse ascending
  const sorted = [...customers].sort((a, b) => {
    const riskRank = { high: 0, medium: 1, low: 2 } as const;
    if (riskRank[a.risk] !== riskRank[b.risk]) {
      return riskRank[a.risk] - riskRank[b.risk];
    }
    return a.pulse - b.pulse;
  });

  return (
    <>
      <Topbar
        kicker="Monitoring"
        title="Portfolio"
        trailing={
          <div className="hidden md:flex items-center gap-2 mono text-[11px] text-ink-3">
            <span className="size-1.5 rounded-full bg-sage animate-pulse" />
            live · synced 4s ago
          </div>
        }
      />

      <div className="flex-1 px-6 lg:px-8 py-8 max-w-[1440px] w-full mx-auto space-y-8 rise">
        {/* Lede block — editorial intro */}
        <section className="grid lg:grid-cols-[2fr_3fr] gap-8 items-end pb-2">
          <div className="space-y-3">
            <p className="kicker" suppressHydrationWarning>As of {new Date().toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
            <h2 className="display text-[40px] leading-[1] text-ink">
              <span className="display-num text-sage-deep">{kpis.avgPulse}</span>
              <span className="text-ink-3"> · </span>
              average pulse across{" "}
              <span className="display-num">{kpis.total}</span>{" "}
              accounts.
            </h2>
            <p className="text-sm text-ink-2 max-w-xl">
              <span className="text-brick font-semibold">{kpis.critical} critical</span> and{" "}
              <span className="text-rust font-semibold">{kpis.atRisk - kpis.critical} at-risk</span>{" "}
              accounts need attention. {kpis.recoveries} accounts have recovered materially in the last two weeks.
            </p>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule border border-rule rounded-[5px] overflow-hidden">
            <KpiCell
              kicker="MRR Tracked"
              value={`$${formatNumber(kpis.totalMrr / 1000)}k`}
              hint="Across portfolio"
            />
            <KpiCell
              kicker="MRR at risk"
              value={`$${formatNumber(kpis.mrrAtRisk / 1000)}k`}
              hint={`${Math.round((kpis.mrrAtRisk / kpis.totalMrr) * 100)}% of total`}
              tone="rust"
            />
            <KpiCell
              kicker="Alerts open"
              value={String(kpis.openAlerts)}
              hint="Across all severities"
              tone={kpis.openAlerts >= 3 ? "rust" : "neutral"}
            />
            <KpiCell
              kicker="Recoveries"
              value={String(kpis.recoveries)}
              hint="+10 pulse over 14d"
              tone="sage"
            />
          </div>
        </section>

        {/* Filters + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-rule py-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <FilterChip active>All <span className="mono text-[10px] text-ink-3 ml-1">{kpis.total}</span></FilterChip>
            <FilterChip>
              <span className="size-1.5 rounded-full bg-brick mr-1.5" /> Critical
              <span className="mono text-[10px] text-ink-3 ml-1">{kpis.critical}</span>
            </FilterChip>
            <FilterChip>
              <span className="size-1.5 rounded-full bg-rust mr-1.5" /> At-risk
              <span className="mono text-[10px] text-ink-3 ml-1">{kpis.atRisk - kpis.critical}</span>
            </FilterChip>
            <FilterChip>
              <span className="size-1.5 rounded-full bg-sage mr-1.5" /> Healthy
              <span className="mono text-[10px] text-ink-3 ml-1">{kpis.total - kpis.atRisk}</span>
            </FilterChip>
            <span className="mx-2 hidden md:inline-block h-4 w-px bg-rule" />
            <FilterChip>Enterprise</FilterChip>
            <FilterChip>Mid-Market</FilterChip>
            <FilterChip>SMB</FilterChip>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 h-7 text-xs text-ink-2 hover:text-ink hover:bg-paper-2 rounded-[3px] transition-colors">
              <Filter className="size-3" strokeWidth={1.75} />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-2.5 h-7 text-xs text-ink-2 hover:text-ink hover:bg-paper-2 rounded-[3px] transition-colors">
              <ArrowUpDown className="size-3" strokeWidth={1.75} />
              Risk → Healthy
            </button>
          </div>
        </div>

        {/* Customer table */}
        <div className="border border-rule rounded-[5px] bg-card overflow-hidden">
          <div className="grid grid-cols-[2.6fr_0.7fr_0.9fr_0.9fr_0.7fr_0.7fr_0.7fr] gap-4 px-5 py-2.5 bg-paper-2 border-b border-rule">
            <ColHeader>Customer</ColHeader>
            <ColHeader>Pulse</ColHeader>
            <ColHeader>Trend · 14d</ColHeader>
            <ColHeader>Status</ColHeader>
            <ColHeader align="right">Issues</ColHeader>
            <ColHeader align="right">MRR</ColHeader>
            <ColHeader align="right">Last heard</ColHeader>
          </div>

          <div className="divide-y divide-rule">
            {sorted.map((c, i) => {
              const owner = members.find((m) => m.email === c.csm);
              const delta = c.pulseDelta;
              const isUp = delta >= 0;
              return (
                <Link
                  key={c.id}
                  href={`/dashboard/customers/${c.id}`}
                  className="grid grid-cols-[2.6fr_0.7fr_0.9fr_0.9fr_0.7fr_0.7fr_0.7fr] gap-4 items-center px-5 py-4 hover:bg-paper-2/70 transition-colors group rise"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Customer */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={cn(
                        "shrink-0 size-9 rounded-[4px] border flex items-center justify-center mono text-[11px] font-semibold",
                        c.risk === "high"
                          ? "bg-brick-tint border-brick/30 text-brick-deep"
                          : c.risk === "medium"
                            ? "bg-rust-tint border-rust/30 text-rust-deep"
                            : "bg-sage-tint border-sage/30 text-sage-deep",
                      )}
                    >
                      {initials(c.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-semibold text-ink truncate group-hover:underline underline-offset-4 decoration-rule-strong">
                          {c.name}
                        </span>
                        {c.unresolvedHighUrgency > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-brick mono">
                            <AlertTriangle className="size-2.5" strokeWidth={2.5} />
                            {c.unresolvedHighUrgency} P1
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="kicker !text-[9.5px]">{c.segment}</span>
                        <span className="size-0.5 rounded-full bg-ink-4" />
                        <span className="text-[11px] text-ink-3">{c.industry}</span>
                        <span className="size-0.5 rounded-full bg-ink-4" />
                        <span className="mono !text-[10px] text-ink-4">{c.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pulse */}
                  <div className="flex items-baseline gap-1.5">
                    <PulseScore value={c.pulse} size="md" />
                    <span
                      className={cn(
                        "inline-flex items-center mono text-[10.5px] tabular",
                        isUp ? "text-sage-strong" : "text-rust-strong",
                      )}
                    >
                      {isUp ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
                      {formatPercent(delta, 1)}
                    </span>
                  </div>

                  {/* Trend sparkline */}
                  <div className="flex items-center">
                    <Sparkline data={c.pulse14d} width={110} height={28} />
                  </div>

                  {/* Risk badge */}
                  <div>
                    <RiskBadge level={c.risk} />
                  </div>

                  {/* Open issues */}
                  <div className="text-right mono text-[12px] tabular text-ink-2">
                    {c.openIssues > 0 ? (
                      <span>
                        {c.openIssues}
                        <span className="text-ink-4"> open</span>
                      </span>
                    ) : (
                      <span className="text-ink-4">—</span>
                    )}
                  </div>

                  {/* MRR */}
                  <div className="text-right mono text-[12px] tabular text-ink-2">
                    ${formatNumber(c.mrrUsd / 1000)}<span className="text-ink-4">k</span>
                  </div>

                  {/* Last heard + owner */}
                  <div className="flex items-center justify-end gap-2">
                    <span className="mono text-[10.5px] text-ink-3 whitespace-nowrap">
                      {relativeTime(c.lastInteractionAt)}
                    </span>
                    {owner && <Avatar initials={owner.initials} size={22} tone="paper" />}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-2.5 bg-paper-2 border-t border-rule flex items-center justify-between">
            <span className="mono text-[10.5px] text-ink-3">
              {sorted.length} accounts · sorted by risk
            </span>
            <span className="mono text-[10.5px] text-ink-3">
              Pulse · weights: 0.40 sentiment · 0.25 resolution · 0.15 escalation · 0.20 engagement
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function ColHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "kicker !text-[9.5px]",
        align === "right" && "text-right",
      )}
    >
      {children}
    </div>
  );
}

function KpiCell({
  kicker,
  value,
  hint,
  tone = "neutral",
}: {
  kicker: string;
  value: string;
  hint: string;
  tone?: "neutral" | "rust" | "sage" | "brick";
}) {
  const accent =
    tone === "rust"
      ? "text-rust-deep"
      : tone === "sage"
        ? "text-sage-deep"
        : tone === "brick"
          ? "text-brick-deep"
          : "text-ink";
  return (
    <div className="bg-card px-5 py-4 space-y-1">
      <div className="kicker !text-[9.5px]">{kicker}</div>
      <div className={cn("display-num text-[28px]", accent)}>{value}</div>
      <div className="text-[11px] text-ink-3">{hint}</div>
    </div>
  );
}

function FilterChip({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center px-2.5 h-7 text-xs rounded-[3px] border transition-colors",
        active
          ? "bg-ink text-paper border-ink"
          : "bg-card text-ink-2 border-rule hover:border-ink-3 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
