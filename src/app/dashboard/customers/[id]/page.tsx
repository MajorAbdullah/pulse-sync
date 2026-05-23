import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Calendar,
  MapPin,
  Briefcase,
  Mail,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { PulseScore } from "@/components/data/pulse-score";
import { Sparkline } from "@/components/data/sparkline";
import { RiskBadge } from "@/components/data/risk-badge";
import { SentimentBadge } from "@/components/data/sentiment-badge";
import { ChannelIcon } from "@/components/data/channel-icon";
import { TrendChart } from "@/components/data/trend-chart";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  customerById,
  interactionsForCustomer,
  members,
} from "@/lib/mock/data";
import { cn, formatNumber, formatPercent, relativeTime } from "@/lib/utils";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = customerById(id);
  if (!customer) notFound();

  const owner = members.find((m) => m.email === customer.csm);
  const ints = interactionsForCustomer(customer.id);

  return (
    <>
      <Topbar
        kicker={
          <span>
            <Link href="/dashboard" className="hover:text-ink transition-colors">
              Portfolio
            </Link>{" "}
            / Customer
          </span>
        }
        title={customer.name}
        trailing={
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="size-3" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="flex-1 px-6 lg:px-8 py-8 max-w-[1440px] w-full mx-auto rise">
        {/* ─── Hero strip ─────────────────────────────────────────────── */}
        <section className="grid lg:grid-cols-[1.5fr_1fr] gap-10 pb-8 border-b border-rule">
          {/* Left: identity */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 kicker">
                <span>{customer.segment}</span>
                <span className="size-0.5 rounded-full bg-ink-4" />
                <span>{customer.industry}</span>
                <span className="size-0.5 rounded-full bg-ink-4" />
                <span>{customer.region}</span>
              </div>
              <h1 className="display text-[52px] leading-[1] text-ink mt-2.5">
                {customer.name}.
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-ink-2">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3 text-ink-3" strokeWidth={1.75} />
                <span className="mono !text-[11px]">{customer.region}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3 text-ink-3" strokeWidth={1.75} />
                <span>
                  Contract ends{" "}
                  <span className="mono !text-[11px]">
                    {new Date(customer.contractEnds).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="size-3 text-ink-3" strokeWidth={1.75} />
                <span>
                  MRR{" "}
                  <span className="mono !text-[11px]">
                    ${formatNumber(customer.mrrUsd / 1000)}k
                  </span>
                </span>
              </span>
              {owner && (
                <span className="inline-flex items-center gap-2">
                  <Avatar initials={owner.initials} size={18} tone="paper" />
                  <span>
                    Owned by <span className="font-semibold text-ink">{owner.name}</span>
                  </span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="primary" size="md">
                <Sparkles className="size-3.5" />
                Draft outreach with AI
              </Button>
              <Button variant="secondary" size="md">
                <Mail className="size-3.5" />
                Open in inbox
              </Button>
              <Button variant="ghost" size="md">
                Resolve & close case
              </Button>
            </div>
          </div>

          {/* Right: hero Pulse Score */}
          <div className="lg:border-l lg:border-rule lg:pl-10 space-y-4">
            <div className="kicker">Customer Pulse</div>
            <div className="flex items-end gap-3 -mb-1">
              <PulseScore value={customer.pulse} size="xl" />
              <div className="pb-3">
                <RiskBadge level={customer.risk} />
                <div
                  className={cn(
                    "mt-1.5 inline-flex items-center gap-1 mono text-xs",
                    customer.pulseDelta >= 0 ? "text-sage-strong" : "text-rust-strong",
                  )}
                >
                  {customer.pulseDelta >= 0 ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {formatPercent(customer.pulseDelta, 1)} over 14d
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Sparkline
                data={customer.pulse14d}
                width={320}
                height={48}
                showDot
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className="mono text-[10px] text-ink-4">14 days ago</span>
                <span className="mono text-[10px] text-ink-4">today</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Tabs ───────────────────────────────────────────────────── */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interactions">
              Interactions
              <span className="mono ml-2 text-[10px] text-ink-3">{ints.length}</span>
            </TabsTrigger>
            <TabsTrigger value="issues">
              Issues
              <span className="mono ml-2 text-[10px] text-ink-3">{customer.topIssues.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* ─── Overview ─── */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-[1.7fr_1fr] gap-8">
              {/* Left column */}
              <div className="space-y-8">
                {/* AI Summary */}
                <article className="bg-card border border-rule rounded-[5px] p-6 relative overflow-hidden">
                  <div
                    aria-hidden
                    className="absolute -right-12 -top-12 display text-[20rem] leading-none text-rust/[0.05] select-none pointer-events-none"
                  >
                    "
                  </div>
                  <div className="flex items-center gap-2 mb-4 relative">
                    <Sparkles className="size-3.5 text-rust" strokeWidth={1.75} />
                    <span className="kicker">AI Summary · generated 4m ago</span>
                  </div>
                  <p className="display text-[20px] leading-[1.4] text-ink relative">
                    "{customer.aiSummary}"
                  </p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-rule relative">
                    <span className="mono text-[10px] text-ink-3">
                      sentiment · emotion · intent · churn-risk synthesized from{" "}
                      {ints.length} interactions across {[
                        ...new Set(ints.map((i) => i.channel)),
                      ].length} channels
                    </span>
                    <Button variant="link" size="sm" className="ml-auto text-[11px]">
                      Regenerate
                    </Button>
                  </div>
                </article>

                {/* Sentiment trend chart */}
                <section className="bg-card border border-rule rounded-[5px] overflow-hidden">
                  <header className="px-5 py-3.5 border-b border-rule flex items-baseline justify-between">
                    <div>
                      <h3 className="text-[13px] font-semibold text-ink">Pulse history</h3>
                      <p className="text-xs text-ink-3 mt-0.5">90-day rolling score</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PillToggle>30d</PillToggle>
                      <PillToggle active>90d</PillToggle>
                      <PillToggle>YTD</PillToggle>
                    </div>
                  </header>
                  <div className="p-5">
                    <TrendChart data={customer.pulse90d} height={240} startDaysAgo={90} />
                  </div>
                </section>

                {/* Component breakdown */}
                <section>
                  <div className="kicker mb-3">Pulse components</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule rounded-[5px] overflow-hidden">
                    <ComponentCell label="Sentiment" value={customer.components.sentiment} weight={0.4} />
                    <ComponentCell label="Resolution" value={customer.components.resolution} weight={0.25} />
                    <ComponentCell label="Escalation" value={customer.components.escalation} weight={0.15} />
                    <ComponentCell label="Engagement" value={customer.components.engagement} weight={0.2} />
                  </div>
                </section>

                {/* Recent interactions preview */}
                <section>
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="kicker">Recent interactions</div>
                    <Link href="#interactions" className="text-[11px] text-ink-3 hover:text-ink transition-colors">
                      View all {ints.length} →
                    </Link>
                  </div>
                  <ul className="space-y-px bg-rule border border-rule rounded-[5px] overflow-hidden">
                    {ints.slice(0, 4).map((it) => (
                      <li key={it.id} className="bg-card px-4 py-3.5 hover:bg-paper-2/60 transition-colors">
                        <div className="flex items-center gap-3 mb-1.5">
                          <ChannelIcon channel={it.channel} withLabel size={11} />
                          <span className="text-[11.5px] text-ink-3 truncate">{it.author}</span>
                          <span className="ml-auto mono text-[10px] text-ink-4 whitespace-nowrap">
                            {relativeTime(it.occurredAt)}
                          </span>
                        </div>
                        <p className="text-[13px] text-ink leading-snug mb-2">{it.content}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <SentimentBadge label={it.sentiment} score={it.sentimentScore} />
                          {it.urgency === "high" && (
                            <Badge tone="brick">
                              <AlertTriangle className="size-2.5" strokeWidth={2.5} /> high urgency
                            </Badge>
                          )}
                          {it.emotions.slice(0, 2).map((e) => (
                            <Badge key={e} tone="outline">
                              {e}
                            </Badge>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Right column — churn signals & top issues rail */}
              <div className="space-y-8">
                {customer.signals.length > 0 && (
                  <section>
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="kicker">Active churn signals</div>
                      <span className="mono text-[10px] text-ink-3">{customer.signals.length}</span>
                    </div>
                    <ul className="space-y-2">
                      {customer.signals.map((s, idx) => (
                        <li
                          key={idx}
                          className="bg-card border border-rule rounded-[5px] p-3.5"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={cn(
                                "size-2 rounded-full",
                                s.severity === "high" ? "bg-brick" : s.severity === "medium" ? "bg-rust" : "bg-ink-4",
                              )}
                            />
                            <span className="kicker !text-[9.5px]">{s.type.replace(/-/g, " · ")}</span>
                            <span className="ml-auto mono text-[10px] text-ink-4">
                              {relativeTime(s.detectedAt)}
                            </span>
                          </div>
                          <p className="text-[12.5px] text-ink leading-snug">{s.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="kicker">Top issues</div>
                    <span className="mono text-[10px] text-ink-3">{customer.topIssues.length}</span>
                  </div>
                  {customer.topIssues.length === 0 ? (
                    <div className="bg-card border border-rule rounded-[5px] p-5 text-center">
                      <p className="text-sm text-ink-3">No issues raised. Healthy quiet.</p>
                    </div>
                  ) : (
                    <ul className="bg-card border border-rule rounded-[5px] divide-y divide-rule">
                      {customer.topIssues.map((iss, idx) => (
                        <li key={idx} className="px-4 py-3">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[13px] text-ink leading-snug">{iss.title}</span>
                            <span className="mono text-[11px] text-ink-3 shrink-0 tabular">×{iss.mentions}</span>
                          </div>
                          <div className="mono text-[10px] text-ink-4 mt-1">
                            first seen {relativeTime(iss.firstSeen)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Suggested action — only if at-risk */}
                {customer.risk !== "low" && (
                  <section className="bg-ink text-paper rounded-[5px] p-5 relative overflow-hidden">
                    <div
                      aria-hidden
                      className="absolute -right-6 -top-6 display text-[14rem] leading-none text-paper/[0.06] pointer-events-none"
                    >
                      ⌁
                    </div>
                    <div className="kicker !text-paper/60 !text-[9.5px] mb-2 relative">Recommended next action</div>
                    <p className="text-[14px] leading-relaxed relative">
                      {customer.risk === "high"
                        ? "Schedule an executive-level call within 48 hours. Bring a written remediation timeline and an interim workaround. Consider offering a service credit."
                        : "Get ahead of this. Schedule a 30-minute technical session this week. Publish the missing docs and acknowledge the recurring rate-limit feedback."}
                    </p>
                    <div className="mt-4 flex gap-2 relative">
                      <button className="text-[11px] px-2.5 h-7 rounded-[3px] bg-paper text-ink hover:bg-paper-2 transition-colors font-medium">
                        Draft with AI
                      </button>
                      <button className="text-[11px] px-2.5 h-7 rounded-[3px] border border-paper/30 text-paper hover:bg-paper/10 transition-colors">
                        Mark in progress
                      </button>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ─── Interactions ─── */}
          <TabsContent value="interactions">
            <div className="bg-card border border-rule rounded-[5px] overflow-hidden">
              <header className="px-5 py-3 border-b border-rule flex items-center gap-2">
                <span className="kicker">Channel</span>
                <ChannelChip>All</ChannelChip>
                <ChannelChip active>Slack</ChannelChip>
                <ChannelChip>Zendesk</ChannelChip>
                <ChannelChip>Surveys</ChannelChip>
                <span className="ml-auto mono text-[10px] text-ink-3">
                  {ints.length} interactions · last 30 days
                </span>
              </header>
              <ul className="divide-y divide-rule">
                {ints.map((it) => (
                  <li key={it.id} className="px-5 py-4 hover:bg-paper-2/60 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <ChannelIcon channel={it.channel} withLabel size={12} />
                      <span className="text-[12.5px] font-medium text-ink">{it.author}</span>
                      <span className="ml-auto mono text-[10.5px] text-ink-3">
                        {it.occurredAt.toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[14px] text-ink leading-relaxed mb-3">{it.content}</p>
                    <p className="text-[12.5px] text-ink-3 italic mb-2.5">
                      AI summary: {it.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <SentimentBadge label={it.sentiment} score={it.sentimentScore} />
                      {it.urgency === "high" && (
                        <Badge tone="brick">
                          <AlertTriangle className="size-2.5" strokeWidth={2.5} /> high urgency
                        </Badge>
                      )}
                      <Badge tone="outline">intent · {it.intent}</Badge>
                      {it.emotions.map((e) => (
                        <Badge key={e} tone="neutral">{e}</Badge>
                      ))}
                    </div>
                    {it.highlights.length > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-rule">
                        <span className="kicker !text-[9px] mr-2">Highlights</span>
                        {it.highlights.map((h, i) => (
                          <span key={i} className="text-[11.5px] text-ink-2">
                            {i > 0 && <span className="text-ink-4 mx-1.5">·</span>}
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* ─── Issues ─── */}
          <TabsContent value="issues">
            {customer.topIssues.length === 0 ? (
              <div className="bg-card border border-rule rounded-[5px] p-12 text-center">
                <p className="display text-[20px] text-ink">No standing issues.</p>
                <p className="text-sm text-ink-3 mt-2 max-w-md mx-auto">
                  This is a quiet account. Any new pain points raised in Slack,
                  Zendesk, or surveys will surface here.
                </p>
              </div>
            ) : (
              <ul className="bg-card border border-rule rounded-[5px] divide-y divide-rule">
                {customer.topIssues.map((iss, idx) => (
                  <li key={idx} className="px-6 py-5 flex items-center gap-6">
                    <span className="display-num text-[28px] text-ink-3 tabular w-12 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14.5px] text-ink leading-snug">{iss.title}</p>
                      <p className="text-[11.5px] text-ink-3 mt-1 mono">
                        first seen {relativeTime(iss.firstSeen)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="display-num text-2xl text-ink tabular">×{iss.mentions}</div>
                      <div className="kicker !text-[9px]">mentions</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function ComponentCell({
  label,
  value,
  weight,
}: {
  label: string;
  value: number;
  weight: number;
}) {
  const tone = value >= 70 ? "sage" : value >= 50 ? "ink" : value >= 35 ? "rust" : "brick";
  return (
    <div className="bg-card p-4 space-y-2.5">
      <div className="flex items-baseline justify-between">
        <span className="kicker !text-[9.5px]">{label}</span>
        <span className="mono text-[10px] text-ink-4">w · {weight.toFixed(2)}</span>
      </div>
      <div
        className={cn(
          "display-num text-[36px]",
          tone === "sage" ? "text-sage-deep" : tone === "rust" ? "text-rust-deep" : tone === "brick" ? "text-brick-deep" : "text-ink",
        )}
      >
        {value}
      </div>
      <div className="h-1 bg-paper-2 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "sage"
              ? "bg-sage"
              : tone === "rust"
                ? "bg-rust"
                : tone === "brick"
                  ? "bg-brick"
                  : "bg-ink",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function PillToggle({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={cn(
        "px-2 h-6 mono text-[10.5px] rounded-[3px] transition-colors",
        active ? "bg-ink text-paper" : "text-ink-3 hover:text-ink hover:bg-paper-2",
      )}
    >
      {children}
    </button>
  );
}

function ChannelChip({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={cn(
        "px-2.5 h-6 text-[11px] rounded-[3px] transition-colors",
        active ? "bg-ink text-paper" : "text-ink-2 hover:text-ink hover:bg-paper-2",
      )}
    >
      {children}
    </button>
  );
}
