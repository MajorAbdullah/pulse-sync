import {
  Hash,
  Ticket,
  ClipboardList,
  Mail,
  Briefcase,
  TrendingUp,
  Video,
  RefreshCw,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { integrations } from "@/lib/mock/data";
import type { Integration, IntegrationType } from "@/lib/types";
import { cn, formatNumber, relativeTime } from "@/lib/utils";

const ICON_MAP: Record<IntegrationType, React.ElementType> = {
  slack: Hash,
  zendesk: Ticket,
  surveys: ClipboardList,
  gmail: Mail,
  outlook: Mail,
  salesforce: Briefcase,
  hubspot: TrendingUp,
  zoom: Video,
};

export default function IntegrationsPage() {
  const connected = integrations.filter((i) => i.status === "connected");
  const available = integrations.filter((i) => i.status !== "connected");
  const p1 = available.filter((i) => i.priority === "P1");
  const p2 = available.filter((i) => i.priority === "P2");

  const totalItems = connected.reduce((a, i) => a + i.itemsSynced, 0);

  return (
    <>
      <Topbar
        kicker="Sources"
        title="Integrations"
        trailing={
          <Button variant="primary" size="md">
            <Plus className="size-3.5" />
            Connect a source
          </Button>
        }
      />

      <div className="flex-1 px-6 lg:px-8 py-8 max-w-[1200px] w-full mx-auto rise space-y-10">
        {/* Lede */}
        <section className="space-y-2">
          <p className="kicker">Composio · pipelines into Pulse</p>
          <h2 className="display text-[36px] leading-tight text-ink max-w-3xl">
            <span className="display-num text-ink">{connected.length}</span> sources connected.
            <span className="text-ink-3"> </span>
            <span className="display-num text-ink">{formatNumber(totalItems)}</span> interactions ingested.
          </h2>
          <p className="text-sm text-ink-2 max-w-2xl">
            Sources are connected through Composio. Each pipeline polls on a
            5-minute schedule, normalizes payloads into a common interaction
            shape, then feeds the AI pipeline.
          </p>
        </section>

        {/* Connected */}
        <Section title="Connected" kicker="Active pipelines" count={connected.length}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {connected.map((i) => (
              <IntegrationCard key={i.id} integration={i} />
            ))}
          </div>
        </Section>

        {/* P1 Available */}
        <Section title="Available · P1" kicker="Recommended next" count={p1.length}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {p1.map((i) => (
              <IntegrationCard key={i.id} integration={i} />
            ))}
          </div>
        </Section>

        {/* P2 Available */}
        <Section title="Available · P2" kicker="Future" count={p2.length}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {p2.map((i) => (
              <IntegrationCard key={i.id} integration={i} />
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

function Section({
  title,
  kicker,
  count,
  children,
}: {
  title: string;
  kicker: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="kicker">{kicker}</span>
        <span className="h-px flex-1 bg-rule" />
        <span className="display text-xl text-ink">
          {title}
          <span className="mono text-sm text-ink-3 ml-2">{count}</span>
        </span>
      </div>
      {children}
    </section>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const Icon = ICON_MAP[integration.type];
  const isConnected = integration.status === "connected";

  return (
    <article
      className={cn(
        "bg-card border rounded-[5px] p-5 flex flex-col gap-4 transition-colors",
        isConnected
          ? "border-rule hover:border-rule-strong"
          : "border-rule hover:border-ink-3 cursor-pointer",
      )}
    >
      <header className="flex items-start gap-3">
        <span
          className={cn(
            "size-10 rounded-[4px] flex items-center justify-center shrink-0",
            isConnected
              ? "bg-sage-tint border border-sage/30"
              : "bg-paper-2 border border-rule",
          )}
        >
          <Icon
            className={cn(
              "size-4",
              isConnected ? "text-sage-deep" : "text-ink-2",
            )}
            strokeWidth={1.75}
          />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-ink">
              {integration.label}
            </h3>
            <Badge tone="outline">{integration.priority}</Badge>
          </div>
          <p className="text-[12px] text-ink-3 mt-1 leading-snug">
            {integration.description}
          </p>
        </div>
      </header>

      <div className="grow" />

      {isConnected ? (
        <>
          {/* metrics row */}
          <div className="grid grid-cols-2 gap-px bg-rule border border-rule rounded-[4px] overflow-hidden">
            <Metric kicker="Items synced" value={formatNumber(integration.itemsSynced)} />
            <Metric
              kicker="Last sync"
              value={
                integration.lastSyncedAt
                  ? relativeTime(integration.lastSyncedAt)
                  : "—"
              }
            />
          </div>
          <footer className="flex items-center gap-2 pt-1">
            <Badge tone="sage">
              <CheckCircle2 className="size-2.5" strokeWidth={2.5} />
              connected
            </Badge>
            <Button variant="secondary" size="sm" className="ml-auto">
              <RefreshCw className="size-3" />
              Sync now
            </Button>
          </footer>
        </>
      ) : (
        <footer className="flex items-center gap-2 pt-1">
          <Badge tone="neutral">{integration.priority === "P1" ? "ready" : "coming"}</Badge>
          <Button variant="primary" size="sm" className="ml-auto" disabled={integration.priority === "P2"}>
            {integration.priority === "P2" ? "Roadmap" : "Connect via Composio"}
          </Button>
        </footer>
      )}
    </article>
  );
}

function Metric({ kicker, value }: { kicker: string; value: string }) {
  return (
    <div className="bg-card px-3 py-2.5">
      <div className="kicker !text-[9px]">{kicker}</div>
      <div className="mono text-[12.5px] text-ink mt-1 tabular">{value}</div>
    </div>
  );
}
