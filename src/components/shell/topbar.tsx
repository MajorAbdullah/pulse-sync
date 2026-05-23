import { Bell, Search, Sparkles } from "lucide-react";
import { alerts } from "@/lib/mock/data";

export function Topbar({
  title,
  kicker,
  trailing,
}: {
  title: string;
  kicker?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  const newAlerts = alerts.filter((a) => a.status === "open").length;

  return (
    <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur border-b border-rule">
      <div className="flex items-center gap-6 px-6 h-[60px]">
        {/* Title */}
        <div className="flex-1 min-w-0">
          {kicker && <div className="kicker !text-[9.5px]">{kicker}</div>}
          <h1 className="display text-[19px] text-ink truncate leading-tight">
            {title}
          </h1>
        </div>

        {/* Search */}
        <button className="hidden lg:flex items-center gap-2 px-2.5 h-8 bg-card border border-rule rounded-[4px] text-ink-3 hover:border-rule-strong hover:text-ink-2 transition-colors min-w-[260px] text-left">
          <Search className="size-3.5" strokeWidth={1.75} />
          <span className="text-xs flex-1">Jump to customer, alert, integration…</span>
          <span className="mono !text-[10px] text-ink-4 border border-rule px-1 rounded-[2px]">⌘K</span>
        </button>

        {/* AI helper hint */}
        <button className="hidden xl:flex items-center gap-1.5 px-2 h-8 text-xs text-ink-3 hover:text-ink transition-colors">
          <Sparkles className="size-3.5" strokeWidth={1.75} />
          <span>Ask PulseSync</span>
        </button>

        {trailing}

        {/* Notification */}
        <button className="relative size-8 rounded-[4px] border border-rule hover:border-rule-strong text-ink-2 hover:text-ink transition-colors flex items-center justify-center">
          <Bell className="size-3.5" strokeWidth={1.75} />
          {newAlerts > 0 && (
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brick text-paper text-[9px] font-bold flex items-center justify-center font-mono">
              {newAlerts}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
