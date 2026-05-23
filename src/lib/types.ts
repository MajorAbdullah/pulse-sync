// PulseIQ — domain types for the prototype. Mirrors PRD §3 data model so
// these types will survive the move to a real backend.

export type RiskLevel = "low" | "medium" | "high";
export type SentimentLabel = "positive" | "neutral" | "negative";
export type UrgencyLevel = "low" | "medium" | "high";
export type AlertStatus = "open" | "acknowledged" | "resolved";
export type AlertSeverity = "info" | "warning" | "critical";
export type Channel = "slack" | "zendesk" | "survey" | "gmail" | "zoom" | "crm";
export type IntegrationStatus = "connected" | "available" | "pending" | "error";
export type IntegrationType =
  | "slack"
  | "zendesk"
  | "gmail"
  | "outlook"
  | "salesforce"
  | "hubspot"
  | "zoom"
  | "surveys";
export type MemberRole = "admin" | "csm" | "viewer";
export type CustomerSegment = "Enterprise" | "Mid-Market" | "SMB";

export interface Customer {
  id: string;
  name: string;
  segment: CustomerSegment;
  industry: string;
  region: string;
  pulse: number;          // 0-100
  pulse14d: number[];     // 14-day sparkline values
  pulse90d: number[];     // 90-day trend
  pulseDelta: number;     // % change over 14d
  risk: RiskLevel;
  mrrUsd: number;
  contractEnds: string;   // ISO date
  csm: string;            // owner email
  lastInteractionAt: Date;
  openIssues: number;
  unresolvedHighUrgency: number;
  components: {
    sentiment: number;
    resolution: number;
    escalation: number;
    engagement: number;
  };
  topIssues: { title: string; mentions: number; firstSeen: Date }[];
  signals: { type: string; severity: RiskLevel; detail: string; detectedAt: Date }[];
  aiSummary: string;
}

export interface Interaction {
  id: string;
  customerId: string;
  channel: Channel;
  author: string;
  content: string;
  occurredAt: Date;
  sentiment: SentimentLabel;
  sentimentScore: number; // -1 to 1
  urgency: UrgencyLevel;
  emotions: string[];
  intent: string;
  highlights: string[];
  summary: string;
}

export interface Alert {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  recommendation: string;
  status: AlertStatus;
  createdAt: Date;
  pulseAtAlert: number;
}

export interface Integration {
  id: string;
  type: IntegrationType;
  label: string;
  description: string;
  status: IntegrationStatus;
  lastSyncedAt: Date | null;
  itemsSynced: number;
  priority: "P0" | "P1" | "P2";
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  initials: string;
  status: "active" | "invited";
  lastActive: Date | null;
}
