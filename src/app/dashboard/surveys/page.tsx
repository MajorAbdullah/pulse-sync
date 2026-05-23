"use client";

import { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const RECENT_IMPORTS = [
  {
    id: "imp_001",
    file: "nps-q2-week-21.csv",
    rows: 412,
    matched: 408,
    uploadedAt: "2 days ago",
    uploadedBy: "Jules Merrick",
    status: "complete" as const,
  },
  {
    id: "imp_002",
    file: "csat-followup-may.csv",
    rows: 137,
    matched: 134,
    uploadedAt: "11 days ago",
    uploadedBy: "Paloma Araya",
    status: "complete" as const,
  },
  {
    id: "imp_003",
    file: "northwind-internal-survey.csv",
    rows: 28,
    matched: 28,
    uploadedAt: "3 weeks ago",
    uploadedBy: "Jules Merrick",
    status: "complete" as const,
  },
];

const COLUMN_MAP = [
  { src: "customer_id", dst: "customer.externalRef", auto: true },
  { src: "response_text", dst: "interaction.content", auto: true },
  { src: "nps_score", dst: "metadata.nps", auto: true },
  { src: "submitted_at", dst: "interaction.occurredAt", auto: true },
  { src: "respondent_email", dst: "interaction.author", auto: false },
];

export default function SurveysPage() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <>
      <Topbar
        kicker="Sources"
        title="Surveys"
        trailing={
          <Button variant="secondary" size="md">
            <FileSpreadsheet className="size-3.5" />
            Download template
          </Button>
        }
      />

      <div className="flex-1 px-6 lg:px-8 py-8 max-w-[1200px] w-full mx-auto rise space-y-10">
        {/* Lede */}
        <section className="space-y-2">
          <p className="kicker">NPS · CSAT · custom</p>
          <h2 className="display text-[36px] leading-tight text-ink max-w-3xl">
            Upload survey responses.
            <span className="text-ink-3"> </span>
            <span className="italic">We do the rest.</span>
          </h2>
          <p className="text-sm text-ink-2 max-w-2xl">
            Drop a CSV. PulseIQ matches respondents to existing customers, runs
            sentiment + theme analysis on free-text responses, and feeds the
            Pulse Score for each affected account.
          </p>
        </section>

        {/* Drop zone */}
        <section
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          className={cn(
            "relative border border-dashed rounded-[6px] bg-paper-2/30 transition-all",
            dragOver ? "border-ink bg-paper-2 scale-[1.005]" : "border-rule-strong",
          )}
        >
          <div className="grid lg:grid-cols-[1fr_1.2fr]">
            {/* Drop side */}
            <div className="p-10 flex flex-col items-center justify-center text-center gap-3 border-r border-rule">
              <span className="size-14 rounded-full bg-card border border-rule flex items-center justify-center">
                <UploadCloud className="size-6 text-ink-2" strokeWidth={1.5} />
              </span>
              <div>
                <p className="display text-[22px] text-ink leading-tight">
                  Drag CSV here
                </p>
                <p className="text-sm text-ink-3 mt-1">
                  or{" "}
                  <button className="text-ink underline underline-offset-4 hover:no-underline">
                    browse files
                  </button>
                </p>
              </div>
              <p className="mono text-[10.5px] text-ink-4">
                Max 50 MB · UTF-8 · header row required
              </p>
            </div>

            {/* Mapping preview side */}
            <div className="p-8 bg-card/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-3.5 text-rust" strokeWidth={1.75} />
                <span className="kicker">Auto-detected mapping · last upload</span>
              </div>
              <ul className="space-y-2">
                {COLUMN_MAP.map((row) => (
                  <li
                    key={row.src}
                    className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2 px-3 py-2 bg-card border border-rule rounded-[4px]"
                  >
                    <span className="mono text-[11.5px] text-ink truncate">{row.src}</span>
                    <ArrowRight className="size-3 text-ink-4" strokeWidth={1.75} />
                    <span className="mono text-[11.5px] text-ink-2 truncate">{row.dst}</span>
                    {row.auto ? (
                      <Badge tone="sage">
                        <Check className="size-2.5" strokeWidth={2.5} /> auto
                      </Badge>
                    ) : (
                      <Badge tone="rust">review</Badge>
                    )}
                  </li>
                ))}
              </ul>
              <Button variant="primary" size="md" className="mt-4 w-full">
                Confirm mapping and import
              </Button>
            </div>
          </div>
        </section>

        {/* Recent imports table */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="kicker">Recent uploads</p>
              <h3 className="display text-[22px] text-ink mt-1">Import history</h3>
            </div>
            <span className="mono text-[10.5px] text-ink-3">{RECENT_IMPORTS.length} files · last 30 days</span>
          </div>
          <div className="bg-card border border-rule rounded-[5px] overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.6fr] gap-4 px-5 py-2.5 bg-paper-2 border-b border-rule">
              <div className="kicker !text-[9.5px]">File</div>
              <div className="kicker !text-[9.5px]">Rows · matched</div>
              <div className="kicker !text-[9.5px]">Uploaded by</div>
              <div className="kicker !text-[9.5px]">When</div>
              <div className="kicker !text-[9.5px] text-right">Status</div>
            </div>
            <ul className="divide-y divide-rule">
              {RECENT_IMPORTS.map((imp) => (
                <li
                  key={imp.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_0.6fr] gap-4 items-center px-5 py-3.5 hover:bg-paper-2/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileSpreadsheet className="size-4 text-ink-3 shrink-0" strokeWidth={1.5} />
                    <span className="mono text-[12px] text-ink truncate">{imp.file}</span>
                  </div>
                  <div className="mono text-[11.5px] text-ink-2 tabular">
                    {imp.rows.toLocaleString()}
                    <span className="text-ink-4"> · </span>
                    <span className="text-sage-deep">{imp.matched} matched</span>
                  </div>
                  <div className="text-[12px] text-ink-2">{imp.uploadedBy}</div>
                  <div className="mono text-[11px] text-ink-3">{imp.uploadedAt}</div>
                  <div className="text-right">
                    <Badge tone="sage">
                      <Check className="size-2.5" strokeWidth={2.5} /> complete
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
