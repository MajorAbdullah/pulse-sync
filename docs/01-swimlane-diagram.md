# PulseSync — Swimlane Diagram (AS-IS & TO-BE)

> **Project:** PulseSync – AI-Powered Customer Pulse Platform
> **Generated:** 2026-05-20
> **Purpose:** Compare the current manual customer-sentiment process (AS-IS)
> against the PulseSync-enabled process (TO-BE).

---

## 1. AS-IS Process — How Customer Sentiment Is Handled Today

Customer feedback is scattered across tools. There is no unified view. Churn is
discovered **after** the customer has already disengaged.

### 1.1 AS-IS Narrative

1. A customer raises issues or feedback across disconnected channels (support
   tickets, email, chat, survey responses, call notes).
2. A **Support Agent** handles each ticket in isolation — resolves it or
   escalates it. Context lives only inside that one tool.
3. A **CSM / Account Manager** occasionally logs into each tool manually,
   skims recent tickets, and jots subjective notes into the CRM.
4. **Management** receives a manually compiled report, usually monthly, that is
   already stale by the time it is read.
5. Churn is identified **reactively** — often only when the customer cancels or
   stops responding.

### 1.2 AS-IS Swimlane

```mermaid
flowchart TD
    subgraph CUST[Lane: Customer]
        C1[Sends feedback via ticket, email or chat]
        C2[Fills NPS or CSAT survey occasionally]
        C3[Goes quiet or cancels contract]
    end

    subgraph AGENT[Lane: Support Agent]
        A1[Receives ticket in support tool]
        A2[Resolves or escalates issue]
        A3[Context stays inside one tool]
    end

    subgraph CSM[Lane: CSM and Account Manager]
        M1[Manually logs into each tool separately]
        M2[Skims tickets and guesses sentiment]
        M3[Writes subjective notes in CRM]
        M4[Misses early warning signs]
    end

    subgraph MGMT[Lane: Management]
        G1[Requests monthly status report]
        G2[Reads stale hand-compiled data]
        G3[Learns of churn after it happens]
    end

    C1 --> A1
    C2 --> M2
    A1 --> A2 --> A3 --> M1
    M1 --> M2 --> M3 --> M4 --> C3
    M3 --> G1 --> G2 --> G3
    C3 --> G3
```

### 1.3 AS-IS Pain Points

| # | Pain Point | Impact |
|---|-----------|--------|
| 1 | Feedback scattered across 6+ tools | No single source of truth |
| 2 | Sentiment judged manually & subjectively | Inconsistent, biased reads |
| 3 | No continuous monitoring | Problems noticed weeks late |
| 4 | Reports compiled by hand | Slow, stale, error-prone |
| 5 | Churn detected reactively | No time to intervene |
| 6 | Does not scale with customer count | CSM time is the bottleneck |

---

## 2. TO-BE Process — With PulseSync

PulseSync continuously ingests interactions from every channel, runs AI sentiment
analysis, computes a unified **Customer Pulse Score**, detects churn risk, and
pushes **proactive alerts and recommendations** to the CSM in real time.

### 2.1 TO-BE Narrative

1. The customer interacts normally across channels — no behavior change needed.
2. **Source systems** (Slack, Zendesk, Gmail/Outlook, Zoom/Meet, Surveys, CRM)
   record those interactions.
3. The **PulseSync Connector Layer** polls each source on a schedule (or receives
   webhooks) and normalizes everything into a common interaction format.
4. The **AI Pipeline** embeds, analyzes sentiment/emotion/urgency, computes the
   Pulse Score, and runs churn-risk detection.
5. When a score drops or risk crosses a threshold, an **Alert** is generated
   with an AI-written recommendation for the next action.
6. The **CSM** receives the alert immediately and acts before the customer
   disengages.
7. **Management** sees live customer health on a dashboard — no manual reports.

### 2.2 TO-BE Swimlane

```mermaid
flowchart TD
    subgraph CUST[Lane: Customer]
        C1[Interacts across channels normally]
    end

    subgraph SRC[Lane: Source Systems]
        S1[Slack, Zendesk, Gmail, Surveys and CRM]
        S2[Interaction recorded in source tool]
    end

    subgraph CONN[Lane: PulseSync Connector Layer]
        N1[Poll APIs on schedule or receive webhook]
        N2[Normalize to common interaction format]
        N3[Enqueue ingestion job]
    end

    subgraph AIP[Lane: PulseSync AI Pipeline]
        P1[Embed text into pgvector]
        P2[Analyze sentiment, emotion, urgency, intent]
        P3[Compute Customer Pulse Score]
        P4[Detect churn-risk signals]
        P5[Generate alert and AI recommendation]
    end

    subgraph CSMLANE[Lane: CSM and Account Manager]
        M1[Receives real-time alert and recommendation]
        M2[Acts proactively before disengagement]
        M3[Customer retained]
    end

    subgraph MGMT[Lane: Management]
        G1[Views live dashboard of health and trends]
        G2[Makes data-driven decisions]
    end

    C1 --> S1 --> S2 --> N1
    N1 --> N2 --> N3 --> P1
    P1 --> P2 --> P3 --> P4 --> P5
    P5 --> M1 --> M2 --> M3
    P3 --> G1
    P4 --> G1
    G1 --> G2
```

### 2.3 TO-BE Improvements

| AS-IS Problem | TO-BE Solution | Outcome |
|---------------|----------------|---------|
| Scattered feedback | Unified Connector Layer | One source of truth |
| Subjective sentiment | AI sentiment analysis | Consistent, scored |
| No monitoring | Continuous ingestion pipeline | Always current |
| Manual reports | Live dashboard | Zero compilation effort |
| Reactive churn | Churn-risk detection + alerts | Proactive intervention |
| Does not scale | Automated per-customer scoring | Scales to all accounts |

---

## 3. AS-IS vs TO-BE Summary

| Dimension | AS-IS | TO-BE |
|-----------|-------|-------|
| Data location | 6+ disconnected tools | Centralized PulseSync DB |
| Sentiment method | Manual, subjective | AI-scored, consistent |
| Monitoring cadence | Occasional, manual | Continuous, automated |
| Churn detection | After the fact | Proactive, predictive signals |
| Alerting | None | Real-time (<5 min target) |
| Reporting | Monthly, hand-built | Live dashboard |
| Scalability | Limited by CSM hours | Scales with automation |
| Recommendations | Tribal knowledge | AI-generated next actions |
