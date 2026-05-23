import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  size = 28,
  tone = "ink",
  className,
}: {
  initials: string;
  size?: number;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const bg = tone === "ink" ? "bg-ink text-paper" : "bg-paper-3 text-ink";
  return (
    <span
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-mono font-medium tracking-tight select-none",
        bg,
        className,
      )}
    >
      {initials}
    </span>
  );
}
