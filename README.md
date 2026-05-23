# PulseIQ

> AI-powered customer pulse, sentiment, and churn-risk monitoring across Slack, Zendesk, and surveys.

PulseIQ continuously reads customer interactions across every channel, runs
LLM sentiment / emotion / urgency analysis on each one, computes a unified
**Pulse Score** per account, detects churn-risk signals via a rule engine,
and pushes proactive alerts with AI-generated next-action recommendations
to CSMs and execs.

**Status:** MVP prototype — frontend with mock data. Backend wiring is planned
per [`docs/plans/`](./docs/plans/).

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo flow: lands on `/sign-in` → any submit goes to `/dashboard`. All data is
mock; the AI summaries, churn signals, and recommendations are pre-written so
the demo can run with no backend at all.

---

## Screenshots

Full set lives in [`./screenshots/`](./screenshots/). Highlights:

| # | Page | File |
|---|---|---|
| 03 | Portfolio · 12 accounts ranked by risk | `screenshots/03-portfolio.png` |
| 04 | Customer detail · Halcyon Bio (critical, churn signals) | `screenshots/04-customer-detail-critical.png` |
| 05 | Customer detail · Vector Analytics (healthy, expansion) | `screenshots/05-customer-detail-healthy.png` |
| 06 | Customer detail · Field Notes Press (recovery save) | `screenshots/06-customer-detail-recovering.png` |
| 07 | Alerts wire-feed with AI recommendations | `screenshots/07-alerts.png` |
| 08 | Integrations · Composio-framed pipelines | `screenshots/08-integrations.png` |
| 09 | Surveys · CSV upload + column mapping | `screenshots/09-surveys.png` |
| 10 | Settings · workspace · members · security · plan | `screenshots/10-settings.png` |

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend + API | Next.js 16 (App Router) + Tailwind 4 + shadcn-style primitives |
| Database | PostgreSQL 17 + pgvector |
| ORM | Drizzle |
| Queue | Redis + BullMQ |
| Worker | Node.js (same repo) |
| AI | Vercel AI SDK + OpenRouter (model-agnostic) |
| Connectors | Composio Cloud (Slack, Zendesk, Gmail, …) |
| Auth | Auth.js v5 + Postgres adapter |
| Email | Resend |
| Object storage | MinIO (S3-compatible) |
| Orchestration | Docker Compose |

---

## Project structure

```
pulseiq/
├── docs/
│   ├── 01-swimlane-diagram.md     # AS-IS vs TO-BE process
│   ├── 02-PRD.md                  # MVP product requirements
│   ├── 03-application-design.md   # Architecture, data model, AI pipeline
│   └── plans/                     # Implementation plan (phases + waves)
├── screenshots/                   # Reference captures
└── src/
    ├── app/
    │   ├── (auth)/                # sign-in, sign-up (split-screen)
    │   └── dashboard/             # portfolio, customers/[id], alerts,
    │                              # integrations, surveys, settings
    ├── components/
    │   ├── data/                  # sparkline, pulse-score, trend-chart, badges
    │   ├── shell/                 # sidebar, topbar, nav
    │   └── ui/                    # button, card, dialog, dropdown, …
    └── lib/
        ├── mock/                  # 12 customers + interactions + alerts + integrations
        ├── types.ts               # Domain types (mirror PRD §3)
        └── utils.ts
```

---

## Design

PulseIQ uses an editorial intelligence-terminal aesthetic — refined, dense,
not the typical AI-app look. Warm cream paper background, ink with a warm
undertone, sage / rust / brick semantic palette, hairline 1px borders
instead of shadows. Typography: Fraunces (display serif), Manrope (body),
JetBrains Mono (numerics).

---

## Documentation

- [Product Requirements (PRD)](./docs/02-PRD.md)
- [Application Design](./docs/03-application-design.md)
- [Process Swimlane · AS-IS vs TO-BE](./docs/01-swimlane-diagram.md)
- [Implementation Plan](./docs/plans/)

---

## License

Proprietary. All rights reserved.
