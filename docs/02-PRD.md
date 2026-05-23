# PulseSync — Product Requirements Document (PRD)

> **Product:** PulseSync – AI-Powered Customer Pulse Platform
> **Version:** 1.0 (MVP)
> **Generated:** 2026-05-20
> **Status:** Approved for MVP build
>

---

## 1. Overview

PulseSync is an AI-powered platform that continuously analyzes customer
interactions across multiple channels to measure **customer sentiment**,
**customer health**, and **churn risk** in real time.

The platform aggregates customer communication from support tools, emails,
chats, call transcripts, surveys, and CRM systems, then generates actionable
insights, **Pulse Scores**, alerts, and AI recommendations.

The goal is a centralized, configurable customer-intelligence system that
replaces today's manual, reactive process.

---

## 2. Problem Statement

Customer feedback and sentiment are scattered across support tickets, emails,
meetings, surveys, chats, and CRM notes. Organizations lack a unified system to:

- Understand customer sentiment.
- Identify unhappy customers early.
- Detect churn risk before it materializes.
- Monitor customer/project health continuously.

Today's processes are **manual, reactive, and hard to scale**. See
`01-swimlane-diagram.md` for the full AS-IS vs TO-BE analysis.

---

## 3. Goals

- Monitor customer sentiment continuously.
- Generate a unified customer/project **Pulse Score**.
- Detect churn risk proactively.
- Provide AI-generated insights and summaries.
- Support configurable integrations and alerting rules.
- Enable real-time alerts and a live dashboard.

### Non-Goals (MVP)

- Voice/audio emotion analysis.
- Advanced predictive churn forecasting (ML models).
- Autonomous remediation workflows.
- Multi-region / high-availability infrastructure.
- Public-scale multi-tenancy hardening (MVP targets 1–10 pilot tenants).

---

## 4. Target Users

| Persona               | Description                 | Primary Use                            |
| --------------------- | --------------------------- | -------------------------------------- |
| CSM / Account Manager | Owns customer relationships | Acts on alerts & recommendations       |
| Support Lead          | Oversees support quality    | Monitors top issues & sentiment trends |
| Management / Exec     | Needs portfolio-level view  | Reviews customer health dashboard      |
| Admin                 | Configures the platform     | Sets up integrations, rules, members   |

**Deployment context:** Internal / pilot use, **1–10 tenant organizations**,
solo developer, MVP target of **2–4 weeks**.

---

## 5. Core Features

### 5.1 Multi-Source Integration

Configurable connectors with credentials stored per organization. MVP uses
**polling** (scheduled API pulls) so it works fully on localhost; webhook mode
is optional via a tunnel.

| Source                  | MVP Priority | Mode                    |
| ----------------------- | ------------ | ----------------------- |
| Slack                   | P0           | Poll channels/messages  |
| Zendesk                 | P0           | Poll tickets & comments |
| Surveys (NPS/CSAT)      | P0           | CSV import + API        |
| Gmail / Outlook         | P1           | Poll threads            |
| Zoom / Meet transcripts | P2           | Transcript file upload  |
| Salesforce / HubSpot    | P2           | Poll account notes      |

### 5.2 AI Sentiment Analysis

For each ingested interaction, the AI pipeline produces:

- **Sentiment score** (−1.0 to +1.0) and label (positive/neutral/negative).
- **Emotion** tags (e.g., frustrated, satisfied, confused).
- **Urgency** level (low/medium/high).
- **Customer intent** (e.g., complaint, question, praise, churn signal).
- **AI summary** of the interaction.
- **Issue highlights** — key problems extracted.

LLM access is via **OpenRouter** through the Vercel AI SDK, so any model
(`anthropic/claude-*`, `openai/gpt-*`, open models) can be selected per
deployment. Embeddings are stored in **pgvector** for similarity search.

### 5.3 Customer Pulse Score

A unified 0–100 health score per customer, recomputed on each new interaction
and on a daily schedule. Inputs:

- Sentiment trend (recent vs historical).
- Count of unresolved issues.
- Escalation frequency.
- Engagement level (interaction recency & volume).

Score is stored as a **time series** so trends can be charted.

### 5.4 Churn Risk Detection

Rule-based signal engine (MVP — no ML forecasting). Flags a customer as
at-risk based on:

- Sustained negative sentiment.
- Repeated complaints on the same topic.
- Declining engagement (drop in interaction volume/recency).
- Unresolved high-priority/high-urgency issues.

Output: a churn-risk level (low/medium/high) with contributing signals listed.

### 5.5 Alerts & Recommendations

Alerts trigger when:

- Pulse Score drops by a configurable threshold.
- Churn risk increases to medium/high.
- Complaint volume spikes for a customer.

Each alert carries an **AI-generated recommendation** for the next best action.
Alert delivery: in-app feed + email (MailHog locally, swappable for SMTP/Resend).

### 5.6 Dashboard

A web dashboard showing:

- Portfolio view: all customers with health/Pulse Score.
- Per-customer detail: sentiment trend chart, top issues, recent interactions.
- Active alerts feed.
- AI-written customer/project summaries.

---

## 6. Tech Stack (Approved)

Local-first, open-source, runs via `docker compose up`. No cloud accounts
required for the MVP.

| Layer          | Technology                                     | Notes                                |
| -------------- | ---------------------------------------------- | ------------------------------------ |
| Frontend       | Next.js 16 (App Router) + Tailwind + shadcn/ui | Single full-stack codebase           |
| API            | Next.js Route Handlers (Node 24)               | No separate backend service for MVP  |
| Database       | PostgreSQL 17 + pgvector                       | Relational + vector in one container |
| ORM            | Drizzle ORM                                    | Type-safe migrations                 |
| Queue          | Redis + BullMQ                                 | Durable jobs, retries, scheduling    |
| Worker         | Node.js worker process (same repo)             | Ingestion + AI jobs                  |
| AI             | Vercel AI SDK + OpenRouter                     | Provider-agnostic LLM access         |
| Auth           | Auth.js (NextAuth v5) + Postgres adapter       | OSS, supports orgs/tenants           |
| Object storage | MinIO (S3-compatible)                          | Transcripts & attachments            |
| Email (dev)    | MailHog                                        | Captures outbound alerts locally     |
| Observability  | Pino logs (+ optional Grafana/Loki/Prometheus) | All local OSS                        |
| Orchestration  | Docker Compose                                 | One-command stack                    |

---

## 7. MVP Scope

**In scope:**

- Org + user auth and multi-tenant data isolation.
- Slack, Zendesk, and Survey ingestion (polling).
- AI sentiment analysis via OpenRouter.
- Customer Pulse Score (computed + time series).
- Rule-based churn risk detection.
- Alerts with AI recommendations (in-app + email).
- Dashboard (portfolio, customer detail, alerts).
- Docker Compose local environment.

**Out of scope (MVP):** see Non-Goals (§3). Gmail/Outlook, Zoom/Meet, and
Salesforce/HubSpot connectors are P1/P2 and stubbed behind the same connector
interface for later.

---

## 8. Success Metrics

| Metric                                                 | Target   |
| ------------------------------------------------------ | -------- |
| Sentiment classification agreement vs human spot-check | > 85%    |
| Alert latency (interaction ingested → alert visible)  | < 5 min  |
| Dashboard initial load time                            | < 2 sec  |
| Local stack uptime during pilot                        | 99%      |
| Time to onboard a new integration                      | < 10 min |

---

## 9. Demo Flow

1. Admin connects Slack + Zendesk + uploads Survey data.
2. The worker ingests customer interactions via polling.
3. The AI pipeline analyzes sentiment and emotion for each interaction.
4. The dashboard shows each customer's Pulse Score and trend.
5. A sustained negative trend is detected for one customer.
6. An alert is triggered automatically with a churn-risk level.
7. PulseSync shows an AI-generated recommended next action.

---

## 10. Functional Requirements

| ID    | Requirement                                                           |
| ----- | --------------------------------------------------------------------- |
| FR-1  | Users can sign up / log in; data is scoped to their organization.     |
| FR-2  | Admins can add, configure, and remove integration connectors.         |
| FR-3  | The system ingests interactions from connected sources on a schedule. |
| FR-4  | Each interaction is analyzed for sentiment, emotion, urgency, intent. |
| FR-5  | Each interaction gets an AI summary and issue highlights.             |
| FR-6  | A Pulse Score is computed per customer and stored as a time series.   |
| FR-7  | Churn-risk signals are evaluated against configurable rules.          |
| FR-8  | Alerts are generated and delivered in-app and via email.              |
| FR-9  | The dashboard displays health, trends, top issues, and alerts.        |
| FR-10 | All LLM calls route through OpenRouter and are model-configurable.    |

---

## 11. Non-Functional Requirements

| ID    | Requirement                                                    |
| ----- | -------------------------------------------------------------- |
| NFR-1 | Entire stack runs locally via a single `docker compose up`.  |
| NFR-2 | Integration credentials are encrypted at rest.                 |
| NFR-3 | Tenant data isolation enforced at the query layer.             |
| NFR-4 | AI pipeline jobs are idempotent and retried on failure.        |
| NFR-5 | LLM provider/model is swappable via environment configuration. |
| NFR-6 | Dashboard pages are responsive and load < 2 sec on pilot data. |

---

## 12. Future Enhancements

- Voice / audio sentiment analysis.
- Predictive churn forecasting with trained ML models.
- AI chatbot assistant for CSMs.
- Auto-generated executive reports.
- Industry benchmarking.
- Webhook-based real-time ingestion at scale.
- Production multi-tenant hardening (SSO, audit logs, multi-region).
