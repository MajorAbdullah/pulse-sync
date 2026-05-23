import type {
  Alert,
  Customer,
  Integration,
  Interaction,
  Member,
} from "../types";

/* ─────────────────────────────────────────────────────────────────────────
   Deterministic pseudo-random number generator so trends don't shuffle
   between renders. Seeded per customer for stable sparklines.
   ───────────────────────────────────────────────────────────────────────── */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function trend(
  seed: number,
  length: number,
  base: number,
  drift: number,
  volatility: number,
) {
  const rng = seeded(seed);
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < length; i++) {
    v += drift + (rng() - 0.5) * volatility;
    v = Math.max(0, Math.min(100, v));
    out.push(Math.round(v));
  }
  return out;
}

function daysAgo(d: number) {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t;
}
function hoursAgo(h: number) {
  const t = new Date();
  t.setHours(t.getHours() - h);
  return t;
}

/* ─────────────────────────────────────────────────────────────────────────
   Customers — 12 entries, varied health profiles. Pulse history aligns
   with each customer's narrative.
   ───────────────────────────────────────────────────────────────────────── */
export const customers: Customer[] = [
  {
    id: "cus_vector",
    name: "Vector Analytics",
    segment: "Enterprise",
    industry: "Data Infrastructure",
    region: "NA · US-East",
    pulse: 92,
    pulse14d: trend(101, 14, 88, 0.4, 4),
    pulse90d: trend(101, 90, 78, 0.18, 5),
    pulseDelta: 4.2,
    risk: "low",
    mrrUsd: 48000,
    contractEnds: "2027-02-14",
    csm: "j.merrick@pulseiq.dev",
    lastInteractionAt: hoursAgo(2),
    openIssues: 1,
    unresolvedHighUrgency: 0,
    components: { sentiment: 96, resolution: 92, escalation: 88, engagement: 90 },
    topIssues: [
      { title: "Snowflake destination intermittently disconnects", mentions: 3, firstSeen: daysAgo(9) },
    ],
    signals: [],
    aiSummary:
      "Strong relationship across all signals. Sentiment trended upward over the last 14 days following the v3.2 release. One low-severity Snowflake disconnect issue is being tracked. Expansion conversation is active — they referenced doubling seat count in last week's QBR.",
  },
  {
    id: "cus_lumen",
    name: "Lumen Robotics",
    segment: "Mid-Market",
    industry: "Industrial Automation",
    region: "EMEA · DE",
    pulse: 78,
    pulse14d: trend(202, 14, 84, -0.4, 5),
    pulse90d: trend(202, 90, 82, -0.03, 6),
    pulseDelta: -7.1,
    risk: "medium",
    mrrUsd: 24000,
    contractEnds: "2026-09-30",
    csm: "j.merrick@pulseiq.dev",
    lastInteractionAt: hoursAgo(7),
    openIssues: 3,
    unresolvedHighUrgency: 1,
    components: { sentiment: 74, resolution: 70, escalation: 82, engagement: 86 },
    topIssues: [
      { title: "Webhook payload schema undocumented", mentions: 6, firstSeen: daysAgo(11) },
      { title: "Rate limit too aggressive on bulk endpoint", mentions: 4, firstSeen: daysAgo(6) },
      { title: "SSO setup confusion", mentions: 2, firstSeen: daysAgo(2) },
    ],
    signals: [
      { type: "declining-engagement", severity: "low", detail: "Slack volume down 38% week-over-week.", detectedAt: daysAgo(3) },
    ],
    aiSummary:
      "Recently slipped from healthy to medium-risk. The webhook documentation gap has come up six times in eleven days across both Slack and Zendesk. Lead engineer indicated they're evaluating a competitor's API in last Thursday's call. Recommend proactive technical session before the next renewal touchpoint.",
  },
  {
    id: "cus_northwind",
    name: "Northwind Logistics",
    segment: "Enterprise",
    industry: "Supply Chain",
    region: "NA · CA",
    pulse: 41,
    pulse14d: trend(303, 14, 58, -1.1, 6),
    pulse90d: trend(303, 90, 71, -0.32, 6),
    pulseDelta: -22.4,
    risk: "high",
    mrrUsd: 62000,
    contractEnds: "2026-08-12",
    csm: "p.araya@pulseiq.dev",
    lastInteractionAt: hoursAgo(4),
    openIssues: 11,
    unresolvedHighUrgency: 4,
    components: { sentiment: 38, resolution: 32, escalation: 44, engagement: 52 },
    topIssues: [
      { title: "Carrier-rate sync fails for FedEx Freight loads", mentions: 14, firstSeen: daysAgo(19) },
      { title: "Dashboard latency above 8s on warehouse view", mentions: 9, firstSeen: daysAgo(12) },
      { title: "Audit log export missing fields after migration", mentions: 7, firstSeen: daysAgo(8) },
    ],
    signals: [
      { type: "sustained-negative", severity: "high", detail: "Avg sentiment −0.41 over 14 days.", detectedAt: daysAgo(5) },
      { type: "repeated-complaint", severity: "high", detail: "Carrier-rate sync cited 14× in 19 days.", detectedAt: daysAgo(7) },
      { type: "unresolved-high-urgency", severity: "medium", detail: "4 unresolved P1 issues open >7d.", detectedAt: daysAgo(2) },
    ],
    aiSummary:
      "Critical risk. Sustained negative sentiment for over two weeks. The carrier-rate sync defect (cited 14 times) is the dominant pain point and now has Northwind's VP of Eng involved. Renewal is 4 months out — without intervention within 7 days, churn probability is materially elevated. Recommend executive-sponsored war-room and a written remediation plan.",
  },
  {
    id: "cus_sable",
    name: "Sable & Co.",
    segment: "SMB",
    industry: "Boutique Retail",
    region: "EU · FR",
    pulse: 88,
    pulse14d: trend(404, 14, 86, 0.2, 3),
    pulse90d: trend(404, 90, 80, 0.1, 4),
    pulseDelta: 2.6,
    risk: "low",
    mrrUsd: 4200,
    contractEnds: "2026-12-01",
    csm: "n.osei@pulseiq.dev",
    lastInteractionAt: hoursAgo(28),
    openIssues: 0,
    unresolvedHighUrgency: 0,
    components: { sentiment: 90, resolution: 94, escalation: 80, engagement: 84 },
    topIssues: [],
    signals: [],
    aiSummary: "Low-touch SMB performing well. No issues open, last NPS was 9. Engagement steady within baseline.",
  },
  {
    id: "cus_halcyon",
    name: "Halcyon Bio",
    segment: "Mid-Market",
    industry: "Biotech",
    region: "NA · US-West",
    pulse: 23,
    pulse14d: trend(505, 14, 40, -1.4, 5),
    pulse90d: trend(505, 90, 56, -0.41, 6),
    pulseDelta: -38.9,
    risk: "high",
    mrrUsd: 38000,
    contractEnds: "2026-07-04",
    csm: "p.araya@pulseiq.dev",
    lastInteractionAt: hoursAgo(11),
    openIssues: 14,
    unresolvedHighUrgency: 6,
    components: { sentiment: 18, resolution: 22, escalation: 28, engagement: 26 },
    topIssues: [
      { title: "Sample-pipeline import drops fields silently", mentions: 18, firstSeen: daysAgo(23) },
      { title: "Compliance report generation broken for EU site", mentions: 11, firstSeen: daysAgo(17) },
      { title: "API key rotation deleted webhooks", mentions: 5, firstSeen: daysAgo(4) },
    ],
    signals: [
      { type: "sustained-negative", severity: "high", detail: "Avg sentiment −0.62 over 14 days.", detectedAt: daysAgo(9) },
      { type: "repeated-complaint", severity: "high", detail: "Sample-pipeline drop cited 18× in 23 days.", detectedAt: daysAgo(11) },
      { type: "unresolved-high-urgency", severity: "high", detail: "6 unresolved P1 issues, 3 open >14d.", detectedAt: daysAgo(3) },
      { type: "declining-engagement", severity: "medium", detail: "No exec touch in 21 days.", detectedAt: daysAgo(1) },
    ],
    aiSummary:
      "Highest-risk account in portfolio. The sample-pipeline silent-drop defect has been raised 18 times and is now blocking their compliance reporting. Their VP of Data referenced 'evaluating alternatives' in a Zendesk reply on Tuesday. This needs an executive-level intervention within 48 hours.",
  },
  {
    id: "cus_prism",
    name: "Prism Studios",
    segment: "SMB",
    industry: "Media Production",
    region: "NA · US-East",
    pulse: 67,
    pulse14d: trend(606, 14, 70, -0.2, 4),
    pulse90d: trend(606, 90, 68, 0, 5),
    pulseDelta: -3.5,
    risk: "medium",
    mrrUsd: 7400,
    contractEnds: "2027-01-20",
    csm: "n.osei@pulseiq.dev",
    lastInteractionAt: hoursAgo(19),
    openIssues: 2,
    unresolvedHighUrgency: 0,
    components: { sentiment: 68, resolution: 72, escalation: 64, engagement: 60 },
    topIssues: [
      { title: "Render queue throughput inconsistent", mentions: 5, firstSeen: daysAgo(10) },
    ],
    signals: [],
    aiSummary: "Stable but with a slight downward bias. The render queue inconsistency is mild but recurring. Worth a check-in within the next 10 days.",
  },
  {
    id: "cus_arc",
    name: "Arc Telemetry",
    segment: "Enterprise",
    industry: "Aerospace",
    region: "NA · US-West",
    pulse: 84,
    pulse14d: trend(707, 14, 82, 0.2, 4),
    pulse90d: trend(707, 90, 76, 0.09, 5),
    pulseDelta: 3.1,
    risk: "low",
    mrrUsd: 55000,
    contractEnds: "2027-04-30",
    csm: "j.merrick@pulseiq.dev",
    lastInteractionAt: hoursAgo(6),
    openIssues: 2,
    unresolvedHighUrgency: 0,
    components: { sentiment: 86, resolution: 80, escalation: 86, engagement: 84 },
    topIssues: [
      { title: "Cold-storage retrieval slower than tier-2 SLA", mentions: 3, firstSeen: daysAgo(7) },
    ],
    signals: [],
    aiSummary: "Healthy. Cold-storage retrieval is the only standing concern and engineering already has a fix in QA.",
  },
  {
    id: "cus_mossback",
    name: "Mossback Brewing",
    segment: "SMB",
    industry: "Beverage",
    region: "NA · US-West",
    pulse: 55,
    pulse14d: trend(808, 14, 60, -0.4, 5),
    pulse90d: trend(808, 90, 64, -0.1, 5),
    pulseDelta: -8.3,
    risk: "medium",
    mrrUsd: 3100,
    contractEnds: "2026-06-15",
    csm: "n.osei@pulseiq.dev",
    lastInteractionAt: hoursAgo(72),
    openIssues: 1,
    unresolvedHighUrgency: 0,
    components: { sentiment: 60, resolution: 54, escalation: 58, engagement: 48 },
    topIssues: [
      { title: "Inventory webhook delays during weekend batches", mentions: 4, firstSeen: daysAgo(14) },
    ],
    signals: [
      { type: "declining-engagement", severity: "low", detail: "No Slack messages in 6 days.", detectedAt: daysAgo(1) },
    ],
    aiSummary: "Slipping. Engagement has gone quiet over the past week. Renewal in under 4 weeks — this warrants a proactive touchpoint.",
  },
  {
    id: "cus_cobalt",
    name: "Cobalt Health",
    segment: "Mid-Market",
    industry: "Healthcare",
    region: "NA · US-East",
    pulse: 48,
    pulse14d: trend(909, 14, 56, -0.6, 6),
    pulse90d: trend(909, 90, 64, -0.15, 6),
    pulseDelta: -14.2,
    risk: "high",
    mrrUsd: 19000,
    contractEnds: "2026-11-10",
    csm: "p.araya@pulseiq.dev",
    lastInteractionAt: hoursAgo(5),
    openIssues: 6,
    unresolvedHighUrgency: 2,
    components: { sentiment: 42, resolution: 50, escalation: 52, engagement: 54 },
    topIssues: [
      { title: "PHI redaction misses free-text fields", mentions: 8, firstSeen: daysAgo(13) },
      { title: "Audit trail export incomplete for HIPAA", mentions: 5, firstSeen: daysAgo(8) },
    ],
    signals: [
      { type: "sustained-negative", severity: "medium", detail: "Avg sentiment −0.28 over 14 days.", detectedAt: daysAgo(6) },
    ],
    aiSummary: "At-risk. PHI redaction defect is a compliance-blocker for their security team. They have a board review next month — getting this resolved before then is critical to renewal.",
  },
  {
    id: "cus_fieldnotes",
    name: "Field Notes Press",
    segment: "SMB",
    industry: "Publishing",
    region: "NA · US-Central",
    pulse: 73,
    pulse14d: trend(1010, 14, 52, 1.5, 4),
    pulse90d: trend(1010, 90, 60, 0.14, 5),
    pulseDelta: 24.6,
    risk: "low",
    mrrUsd: 5300,
    contractEnds: "2026-10-22",
    csm: "n.osei@pulseiq.dev",
    lastInteractionAt: hoursAgo(13),
    openIssues: 1,
    unresolvedHighUrgency: 0,
    components: { sentiment: 78, resolution: 76, escalation: 70, engagement: 68 },
    topIssues: [
      { title: "CSV import header detection edge cases", mentions: 2, firstSeen: daysAgo(5) },
    ],
    signals: [],
    aiSummary: "Strong recovery. Was at 49 two weeks ago after a bumpy onboarding. The team has since shipped three of the four requested fixes, and sentiment has reversed course sharply.",
  },
  {
    id: "cus_kelvin",
    name: "Kelvin Industrial",
    segment: "Enterprise",
    industry: "Manufacturing",
    region: "APAC · JP",
    pulse: 81,
    pulse14d: trend(1111, 14, 78, 0.2, 4),
    pulse90d: trend(1111, 90, 74, 0.08, 5),
    pulseDelta: 2.3,
    risk: "low",
    mrrUsd: 44000,
    contractEnds: "2027-03-18",
    csm: "j.merrick@pulseiq.dev",
    lastInteractionAt: hoursAgo(31),
    openIssues: 2,
    unresolvedHighUrgency: 0,
    components: { sentiment: 84, resolution: 78, escalation: 80, engagement: 82 },
    topIssues: [
      { title: "OEE rollup off by 0.4% during shift handover", mentions: 3, firstSeen: daysAgo(11) },
    ],
    signals: [],
    aiSummary: "Healthy enterprise account. OEE rollup discrepancy is the only standing item; engineering has root-caused it.",
  },
  {
    id: "cus_brevet",
    name: "Brevet & Lane",
    segment: "Mid-Market",
    industry: "Legal Tech",
    region: "EMEA · UK",
    pulse: 36,
    pulse14d: trend(1212, 14, 50, -1.0, 5),
    pulse90d: trend(1212, 90, 62, -0.28, 6),
    pulseDelta: -26.1,
    risk: "high",
    mrrUsd: 22000,
    contractEnds: "2026-09-04",
    csm: "p.araya@pulseiq.dev",
    lastInteractionAt: hoursAgo(9),
    openIssues: 9,
    unresolvedHighUrgency: 3,
    components: { sentiment: 30, resolution: 36, escalation: 40, engagement: 38 },
    topIssues: [
      { title: "Matter-merge dedupes citations incorrectly", mentions: 12, firstSeen: daysAgo(18) },
      { title: "Slow document search on practice corpora", mentions: 7, firstSeen: daysAgo(10) },
    ],
    signals: [
      { type: "sustained-negative", severity: "high", detail: "Avg sentiment −0.45 over 14 days.", detectedAt: daysAgo(8) },
      { type: "repeated-complaint", severity: "high", detail: "Citation dedupe cited 12× in 18 days.", detectedAt: daysAgo(6) },
    ],
    aiSummary: "High-risk. The citation dedupe defect is causing real client-facing pain for their partners. Their managing partner sent a strongly worded email Tuesday — needs handling at director level.",
  },
];

export const customerById = (id: string) => customers.find((c) => c.id === id);

/* ─────────────────────────────────────────────────────────────────────────
   Interactions — realistic mix per customer
   ───────────────────────────────────────────────────────────────────────── */
export const interactions: Interaction[] = [
  // Northwind (high-risk)
  {
    id: "int_001",
    customerId: "cus_northwind",
    channel: "slack",
    author: "Dana Wei (Northwind, VP Eng)",
    content:
      "Carrier-rate sync is broken again for FedEx Freight. This is the third time this month. Our ops floor is now keying rates manually — that's a hard no for us at this contract value.",
    occurredAt: hoursAgo(4),
    sentiment: "negative",
    sentimentScore: -0.72,
    urgency: "high",
    emotions: ["frustrated", "escalating"],
    intent: "complaint",
    highlights: ["FedEx Freight sync broken", "manual rate keying", "ops floor impacted"],
    summary: "VP Eng reports recurring FedEx Freight rate-sync failure; ops impact; escalation signal present.",
  },
  {
    id: "int_002",
    customerId: "cus_northwind",
    channel: "zendesk",
    author: "Renata Lopes (Northwind, Ops Lead)",
    content:
      "Warehouse-view dashboard taking 8–11 seconds to load this morning. P50 was 1.2s last week. What changed?",
    occurredAt: hoursAgo(7),
    sentiment: "negative",
    sentimentScore: -0.41,
    urgency: "high",
    emotions: ["confused", "concerned"],
    intent: "incident-report",
    highlights: ["dashboard latency 8-11s", "P50 was 1.2s"],
    summary: "Operations lead reports 7-9× regression in warehouse view dashboard latency.",
  },
  {
    id: "int_003",
    customerId: "cus_northwind",
    channel: "survey",
    author: "Anonymous (NPS)",
    content: "Would you recommend us? 2/10. Detractor.",
    occurredAt: daysAgo(2),
    sentiment: "negative",
    sentimentScore: -0.8,
    urgency: "medium",
    emotions: ["disappointed"],
    intent: "feedback",
    highlights: ["NPS 2/10", "detractor"],
    summary: "NPS detractor response (2/10).",
  },
  // Halcyon (critical)
  {
    id: "int_010",
    customerId: "cus_halcyon",
    channel: "zendesk",
    author: "Marius Pham (Halcyon, VP Data)",
    content:
      "We need to evaluate alternatives. The sample-pipeline silent-drop has been raised since August and we still don't have a fix or a credible ETA. This is now blocking our EU compliance reporting.",
    occurredAt: hoursAgo(11),
    sentiment: "negative",
    sentimentScore: -0.88,
    urgency: "high",
    emotions: ["frustrated", "considering-churn"],
    intent: "churn-signal",
    highlights: ["evaluate alternatives", "blocking EU compliance", "no credible ETA"],
    summary: "VP Data explicitly states intent to evaluate alternatives; cites compliance blocker; clear churn signal.",
  },
  {
    id: "int_011",
    customerId: "cus_halcyon",
    channel: "slack",
    author: "Saoirse Crowe (Halcyon, Eng Lead)",
    content: "API key rotation seems to have wiped our webhook config. Two ETL jobs failed silently overnight.",
    occurredAt: daysAgo(4),
    sentiment: "negative",
    sentimentScore: -0.62,
    urgency: "high",
    emotions: ["frustrated"],
    intent: "incident-report",
    highlights: ["API key rotation wiped webhooks", "silent failures"],
    summary: "Eng Lead reports webhook config loss tied to API key rotation; data pipeline impact.",
  },
  // Lumen (medium-risk)
  {
    id: "int_020",
    customerId: "cus_lumen",
    channel: "slack",
    author: "Lukas Brandt (Lumen, Eng)",
    content:
      "Webhook schema docs are incomplete for the new event types. We're reverse-engineering from sample payloads, which is fragile.",
    occurredAt: hoursAgo(7),
    sentiment: "negative",
    sentimentScore: -0.35,
    urgency: "medium",
    emotions: ["frustrated"],
    intent: "documentation-request",
    highlights: ["webhook schema docs incomplete", "reverse engineering"],
    summary: "Engineering team blocked on undocumented webhook payloads.",
  },
  {
    id: "int_021",
    customerId: "cus_lumen",
    channel: "zendesk",
    author: "Mira Falk (Lumen, Platform Lead)",
    content: "Bulk endpoint rate limit is too aggressive — 60 r/m doesn't fit our nightly reconciliation window.",
    occurredAt: daysAgo(2),
    sentiment: "neutral",
    sentimentScore: -0.1,
    urgency: "medium",
    emotions: ["constructive"],
    intent: "feature-request",
    highlights: ["rate limit 60 r/m", "nightly reconciliation"],
    summary: "Platform lead requests rate limit increase for bulk endpoint.",
  },
  // Vector (healthy)
  {
    id: "int_030",
    customerId: "cus_vector",
    channel: "slack",
    author: "Hugo Park (Vector, Head of Data)",
    content: "v3.2 has been a massive improvement. Sync stability is night and day. Discussing doubling seat count internally.",
    occurredAt: hoursAgo(2),
    sentiment: "positive",
    sentimentScore: 0.84,
    urgency: "low",
    emotions: ["enthusiastic"],
    intent: "praise",
    highlights: ["v3.2 massive improvement", "doubling seats"],
    summary: "Head of Data praises v3.2 release; expansion signal — referenced doubling seat count.",
  },
  {
    id: "int_031",
    customerId: "cus_vector",
    channel: "zendesk",
    author: "Theo Renner (Vector, Eng)",
    content: "Snowflake destination dropped connection at 03:14 UTC and reconnected automatically. Just flagging.",
    occurredAt: daysAgo(1),
    sentiment: "neutral",
    sentimentScore: 0.05,
    urgency: "low",
    emotions: ["informational"],
    intent: "low-severity-report",
    highlights: ["Snowflake brief disconnect"],
    summary: "Low-severity Snowflake disconnect; auto-recovered.",
  },
  // Field Notes Press (recovering)
  {
    id: "int_040",
    customerId: "cus_fieldnotes",
    channel: "slack",
    author: "Iris Acharya (Field Notes, Founder)",
    content: "Thank you for the turnaround on the three import fixes. Genuinely impressed. We're back on track.",
    occurredAt: hoursAgo(13),
    sentiment: "positive",
    sentimentScore: 0.78,
    urgency: "low",
    emotions: ["grateful", "relieved"],
    intent: "praise",
    highlights: ["thank you for turnaround", "back on track"],
    summary: "Founder expresses gratitude for rapid fixes; recovery confirmed.",
  },
  // Brevet (critical)
  {
    id: "int_050",
    customerId: "cus_brevet",
    channel: "zendesk",
    author: "Margaret Holloway (Brevet, Managing Partner)",
    content:
      "Two of our partners had to apologise to clients yesterday because of the citation dedupe issue. This cannot continue.",
    occurredAt: hoursAgo(9),
    sentiment: "negative",
    sentimentScore: -0.78,
    urgency: "high",
    emotions: ["angry", "escalating"],
    intent: "complaint",
    highlights: ["partners apologised to clients", "cannot continue"],
    summary: "Managing partner escalates citation dedupe defect; partner-level client impact.",
  },
  // Cobalt
  {
    id: "int_060",
    customerId: "cus_cobalt",
    channel: "zendesk",
    author: "Devon Mbeki (Cobalt, Security)",
    content:
      "PHI redaction missing free-text fields is a compliance blocker for our board review on June 18.",
    occurredAt: hoursAgo(5),
    sentiment: "negative",
    sentimentScore: -0.5,
    urgency: "high",
    emotions: ["concerned"],
    intent: "compliance-issue",
    highlights: ["PHI redaction misses free text", "board review June 18"],
    summary: "Security team flags compliance-blocking redaction defect tied to board deadline.",
  },
  // Mossback
  {
    id: "int_070",
    customerId: "cus_mossback",
    channel: "slack",
    author: "Cal Whitt (Mossback, Ops)",
    content: "Hey — quick question about the inventory webhook delays on weekend batches. Is that expected?",
    occurredAt: daysAgo(3),
    sentiment: "neutral",
    sentimentScore: -0.05,
    urgency: "low",
    emotions: ["curious"],
    intent: "question",
    highlights: ["weekend webhook delays"],
    summary: "Ops asks whether weekend inventory webhook delays are expected.",
  },
];

export const interactionsForCustomer = (cid: string) =>
  interactions.filter((i) => i.customerId === cid);

/* ─────────────────────────────────────────────────────────────────────────
   Alerts — generated from highest-risk customers
   ───────────────────────────────────────────────────────────────────────── */
export const alerts: Alert[] = [
  {
    id: "alt_001",
    customerId: "cus_halcyon",
    customerName: "Halcyon Bio",
    type: "Churn signal detected",
    severity: "critical",
    message:
      "VP Data explicitly mentioned 'evaluating alternatives' in a Zendesk reply on Tuesday. Combined with sustained negative sentiment and unresolved compliance blocker, churn probability is materially elevated.",
    recommendation:
      "Schedule an executive-level call with their VP Data within 48 hours. Bring a written remediation timeline for the sample-pipeline defect and an interim workaround for EU compliance reporting. Offer a service credit for May.",
    status: "open",
    createdAt: hoursAgo(11),
    pulseAtAlert: 23,
  },
  {
    id: "alt_002",
    customerId: "cus_northwind",
    customerName: "Northwind Logistics",
    type: "Repeated complaint threshold",
    severity: "critical",
    message:
      "FedEx Freight carrier-rate sync defect has been cited 14 times across 19 days. Now blocking warehouse-floor operations.",
    recommendation:
      "Stand up an internal war-room. Move the defect to a named owner with a daily Slack update to Northwind. Pulse score has dropped 22 points in 14 days — renewal is 4 months out and at material risk.",
    status: "open",
    createdAt: hoursAgo(4),
    pulseAtAlert: 41,
  },
  {
    id: "alt_003",
    customerId: "cus_brevet",
    customerName: "Brevet & Lane",
    type: "Sustained negative sentiment",
    severity: "critical",
    message:
      "Managing Partner sent a strongly worded escalation on Tuesday. Avg sentiment −0.45 over 14 days. Two of their partners had to apologise to clients.",
    recommendation:
      "Get your VP of Customer Success on a call with their Managing Partner this week. Bring engineering. The citation dedupe defect needs a public hot-fix ETA they can communicate to their partners.",
    status: "open",
    createdAt: hoursAgo(9),
    pulseAtAlert: 36,
  },
  {
    id: "alt_004",
    customerId: "cus_cobalt",
    customerName: "Cobalt Health",
    type: "Compliance-blocking issue",
    severity: "warning",
    message:
      "PHI redaction defect tied to their June 18 board review. Pulse trending downward (−14 over 14d).",
    recommendation:
      "Escalate the redaction fix to engineering with the June 18 date attached. Offer to attend their board prep call to walk through resolution.",
    status: "open",
    createdAt: hoursAgo(5),
    pulseAtAlert: 48,
  },
  {
    id: "alt_005",
    customerId: "cus_lumen",
    customerName: "Lumen Robotics",
    type: "Pulse drop threshold",
    severity: "warning",
    message:
      "Pulse score dropped 7 points in 14 days. Webhook documentation gap cited 6 times. Engineering hinted at evaluating competitor's API.",
    recommendation:
      "Schedule a technical session — bring DX and product. Publish the missing webhook schema docs this week. Treat as pre-renewal save signal.",
    status: "open",
    createdAt: hoursAgo(14),
    pulseAtAlert: 78,
  },
  {
    id: "alt_006",
    customerId: "cus_mossback",
    customerName: "Mossback Brewing",
    type: "Declining engagement",
    severity: "info",
    message: "No Slack messages in 6 days. Renewal in under 4 weeks.",
    recommendation: "Send a casual check-in note from their CSM. Ask about the weekend webhook delay they raised.",
    status: "acknowledged",
    createdAt: daysAgo(1),
    pulseAtAlert: 55,
  },
  {
    id: "alt_007",
    customerId: "cus_fieldnotes",
    customerName: "Field Notes Press",
    type: "Recovery confirmed",
    severity: "info",
    message: "Pulse score recovered 25 points over 14 days following onboarding fixes. Founder sent direct thanks.",
    recommendation: "Capture this as a save-story. Ask the founder for a quote — they'd likely give one.",
    status: "resolved",
    createdAt: daysAgo(2),
    pulseAtAlert: 49,
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Integrations
   ───────────────────────────────────────────────────────────────────────── */
export const integrations: Integration[] = [
  {
    id: "intg_slack",
    type: "slack",
    label: "Slack",
    description: "Channels, threads, customer DMs. Polled every 5 min.",
    status: "connected",
    lastSyncedAt: hoursAgo(0.05),
    itemsSynced: 12490,
    priority: "P0",
  },
  {
    id: "intg_zendesk",
    type: "zendesk",
    label: "Zendesk",
    description: "Tickets, comments, satisfaction ratings. Polled every 5 min.",
    status: "connected",
    lastSyncedAt: hoursAgo(0.08),
    itemsSynced: 4316,
    priority: "P0",
  },
  {
    id: "intg_surveys",
    type: "surveys",
    label: "Surveys (CSV)",
    description: "NPS / CSAT imports via CSV upload or API.",
    status: "connected",
    lastSyncedAt: daysAgo(2),
    itemsSynced: 1218,
    priority: "P0",
  },
  {
    id: "intg_gmail",
    type: "gmail",
    label: "Gmail",
    description: "Customer email threads from a shared mailbox.",
    status: "available",
    lastSyncedAt: null,
    itemsSynced: 0,
    priority: "P1",
  },
  {
    id: "intg_outlook",
    type: "outlook",
    label: "Outlook",
    description: "Customer email threads from a shared mailbox.",
    status: "available",
    lastSyncedAt: null,
    itemsSynced: 0,
    priority: "P1",
  },
  {
    id: "intg_salesforce",
    type: "salesforce",
    label: "Salesforce",
    description: "Account notes, opportunities, activity history.",
    status: "available",
    lastSyncedAt: null,
    itemsSynced: 0,
    priority: "P2",
  },
  {
    id: "intg_hubspot",
    type: "hubspot",
    label: "HubSpot",
    description: "Deal notes, contact properties, engagements.",
    status: "available",
    lastSyncedAt: null,
    itemsSynced: 0,
    priority: "P2",
  },
  {
    id: "intg_zoom",
    type: "zoom",
    label: "Zoom",
    description: "Meeting transcripts (recordings post-processed).",
    status: "available",
    lastSyncedAt: null,
    itemsSynced: 0,
    priority: "P2",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Team members
   ───────────────────────────────────────────────────────────────────────── */
export const members: Member[] = [
  {
    id: "mem_1",
    name: "Jules Merrick",
    email: "j.merrick@pulseiq.dev",
    role: "csm",
    initials: "JM",
    status: "active",
    lastActive: hoursAgo(0.1),
  },
  {
    id: "mem_2",
    name: "Paloma Araya",
    email: "p.araya@pulseiq.dev",
    role: "csm",
    initials: "PA",
    status: "active",
    lastActive: hoursAgo(0.5),
  },
  {
    id: "mem_3",
    name: "Nadia Osei",
    email: "n.osei@pulseiq.dev",
    role: "csm",
    initials: "NO",
    status: "active",
    lastActive: hoursAgo(1.2),
  },
  {
    id: "mem_4",
    name: "Imani Bell",
    email: "i.bell@pulseiq.dev",
    role: "admin",
    initials: "IB",
    status: "active",
    lastActive: hoursAgo(3),
  },
  {
    id: "mem_5",
    name: "Henrik Lødberg",
    email: "h.lodberg@pulseiq.dev",
    role: "viewer",
    initials: "HL",
    status: "active",
    lastActive: daysAgo(1),
  },
  {
    id: "mem_6",
    name: "Yuna Watari",
    email: "y.watari@pulseiq.dev",
    role: "csm",
    initials: "YW",
    status: "invited",
    lastActive: null,
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Aggregates — portfolio KPI strip
   ───────────────────────────────────────────────────────────────────────── */
export function portfolioKpis() {
  const total = customers.length;
  const avgPulse = Math.round(customers.reduce((a, c) => a + c.pulse, 0) / total);
  const atRisk = customers.filter((c) => c.risk !== "low").length;
  const critical = customers.filter((c) => c.risk === "high").length;
  const openAlerts = alerts.filter((a) => a.status === "open").length;
  const mrrAtRisk = customers
    .filter((c) => c.risk !== "low")
    .reduce((a, c) => a + c.mrrUsd, 0);
  const totalMrr = customers.reduce((a, c) => a + c.mrrUsd, 0);
  const recoveries = customers.filter((c) => c.pulseDelta > 10).length;

  return {
    total,
    avgPulse,
    atRisk,
    critical,
    openAlerts,
    mrrAtRisk,
    totalMrr,
    recoveries,
  };
}

export const orgName = "Inflectiv";
export const currentUser = members[0];
