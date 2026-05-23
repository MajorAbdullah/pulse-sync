import { cn } from "@/lib/utils";

interface PulseScoreProps {
  value: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE: Record<NonNullable<PulseScoreProps["size"]>, string> = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-6xl",
};

function tone(value: number) {
  if (value >= 70) return "text-sage-deep";
  if (value >= 50) return "text-ink";
  if (value >= 35) return "text-rust-deep";
  return "text-brick-deep";
}

export function PulseScore({ value, size = "md", className }: PulseScoreProps) {
  return (
    <span
      className={cn("display-num inline-block tabular", SIZE[size], tone(value), className)}
      aria-label={`Pulse Score ${value}`}
    >
      {Math.round(value)}
    </span>
  );
}
