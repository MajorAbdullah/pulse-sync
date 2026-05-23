import { UserPlus, Shield, KeyRound, Lock } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Label } from "@/components/ui/input";
import { members } from "@/lib/mock/data";
import type { MemberRole } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";

const ROLE_LABEL: Record<MemberRole, string> = {
  admin: "Admin",
  csm: "CSM",
  viewer: "Viewer",
};

const ROLE_TONE: Record<MemberRole, "ink" | "rust" | "outline"> = {
  admin: "ink",
  csm: "rust",
  viewer: "outline",
};

export default function SettingsPage() {
  return (
    <>
      <Topbar kicker="Workspace" title="Settings" />

      <div className="flex-1 px-6 lg:px-8 py-8 max-w-[1100px] w-full mx-auto rise space-y-12">
        {/* ─── Workspace ─── */}
        <Section
          eyebrow="Workspace"
          title="Inflectiv"
          description="These settings apply across the whole workspace. Only admins can edit."
        >
          <div className="bg-card border border-rule rounded-[5px] p-6 space-y-5">
            <Field
              label="Workspace name"
              defaultValue="Inflectiv"
              hint="Shown in the sidebar and emails."
            />
            <Field
              label="Display domain"
              defaultValue="inflectiv.dev"
              hint="Used to auto-detect new sign-ups belonging to this workspace."
            />
            <div className="grid md:grid-cols-2 gap-5 pt-2 border-t border-rule">
              <Field
                label="Default OpenRouter model · analysis"
                defaultValue="anthropic/claude-3.5-haiku"
                mono
              />
              <Field
                label="Default OpenRouter model · recommendations"
                defaultValue="anthropic/claude-3.5-sonnet"
                mono
              />
            </div>
          </div>
        </Section>

        {/* ─── Members ─── */}
        <Section
          eyebrow="People"
          title="Members"
          description={`${members.filter((m) => m.status === "active").length} active · ${
            members.filter((m) => m.status === "invited").length
          } invited`}
          action={
            <Button variant="primary" size="md">
              <UserPlus className="size-3.5" />
              Invite member
            </Button>
          }
        >
          <div className="bg-card border border-rule rounded-[5px] overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_0.7fr_0.9fr_0.4fr] gap-4 px-5 py-2.5 bg-paper-2 border-b border-rule">
              <ColHead>Member</ColHead>
              <ColHead>Email</ColHead>
              <ColHead>Role</ColHead>
              <ColHead>Last active</ColHead>
              <ColHead align="right">·</ColHead>
            </div>
            <ul className="divide-y divide-rule">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="grid grid-cols-[2fr_1fr_0.7fr_0.9fr_0.4fr] gap-4 items-center px-5 py-3 hover:bg-paper-2/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={m.initials} size={28} tone="paper" />
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-ink truncate flex items-center gap-2">
                        {m.name}
                        {m.status === "invited" && (
                          <Badge tone="outline">invited</Badge>
                        )}
                      </div>
                      <div className="mono text-[10.5px] text-ink-4">{m.id}</div>
                    </div>
                  </div>
                  <div className="mono text-[12px] text-ink-2 truncate">{m.email}</div>
                  <div>
                    <Badge tone={ROLE_TONE[m.role]}>
                      <Shield className="size-2.5" strokeWidth={2.5} />
                      {ROLE_LABEL[m.role]}
                    </Badge>
                  </div>
                  <div className="mono text-[11px] text-ink-3">
                    {m.lastActive ? relativeTime(m.lastActive) : "—"}
                  </div>
                  <div className="text-right">
                    <button className="text-ink-3 hover:text-ink text-lg leading-none">⋯</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ─── Security ─── */}
        <Section
          eyebrow="Security"
          title="Authentication & data"
          description="Credential encryption, audit trail, and tenant isolation are enforced workspace-wide."
        >
          <div className="grid md:grid-cols-2 gap-3">
            <SecurityCard
              icon={<Lock className="size-4" strokeWidth={1.75} />}
              title="Credential encryption"
              status="active"
              detail="AES-256-GCM for all integration credentials. Key sourced from environment."
            />
            <SecurityCard
              icon={<Shield className="size-4" strokeWidth={1.75} />}
              title="Tenant isolation"
              status="active"
              detail="Every tenant-scoped query is guarded by a Drizzle helper. Audited weekly."
            />
            <SecurityCard
              icon={<KeyRound className="size-4" strokeWidth={1.75} />}
              title="SSO · SAML"
              status="pending"
              detail="Available on Enterprise tier. Contact your CSM to enable."
            />
            <SecurityCard
              icon={<Shield className="size-4" strokeWidth={1.75} />}
              title="Audit log"
              status="pending"
              detail="Coming with post-pilot hardening. Logs are currently retained 30 days."
            />
          </div>
        </Section>

        {/* ─── Plan ─── */}
        <Section eyebrow="Billing" title="Plan" description="Pilot · 1–10 tenants">
          <div className="bg-card border border-rule rounded-[5px] p-6 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="kicker !text-[9.5px]">Current tier</div>
              <h4 className="display text-[28px] text-ink mt-1">Pilot</h4>
              <p className="text-sm text-ink-3 max-w-md mt-2">
                Full feature set, capped at 10 customer-tenant workspaces and 12
                team members. Billing begins at general availability.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 min-w-[180px]">
              <Button variant="primary" size="md">Talk to sales</Button>
              <Button variant="ghost" size="sm">View pricing</Button>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}

function Section({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="flex items-end justify-between gap-4 mb-4 pb-3 border-b border-rule">
        <div>
          <p className="kicker">{eyebrow}</p>
          <h3 className="display text-[28px] text-ink mt-1.5 leading-none">{title}</h3>
          {description && (
            <p className="text-sm text-ink-3 mt-2 max-w-xl">{description}</p>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  defaultValue,
  hint,
  mono,
}: {
  label: string;
  defaultValue: string;
  hint?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        defaultValue={defaultValue}
        className={cn(mono && "font-mono text-[12px]")}
      />
      {hint && <p className="text-[11.5px] text-ink-3 mt-1.5">{hint}</p>}
    </div>
  );
}

function ColHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("kicker !text-[9.5px]", align === "right" && "text-right")}>
      {children}
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  status,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  status: "active" | "pending";
  detail: string;
}) {
  return (
    <article className="bg-card border border-rule rounded-[5px] p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className={cn(
            "size-7 rounded-[4px] flex items-center justify-center",
            status === "active"
              ? "bg-sage-tint text-sage-deep border border-sage/30"
              : "bg-paper-2 text-ink-3 border border-rule",
          )}
        >
          {icon}
        </span>
        <h4 className="text-[13px] font-semibold text-ink flex-1">{title}</h4>
        <Badge tone={status === "active" ? "sage" : "outline"}>
          {status === "active" ? "active" : "available"}
        </Badge>
      </div>
      <p className="text-[12.5px] text-ink-2 leading-relaxed">{detail}</p>
    </article>
  );
}
