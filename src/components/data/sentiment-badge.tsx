import type { SentimentLabel } from "@/lib/types";
import { Badge } from "../ui/badge";

const TONE: Record<SentimentLabel, "sage" | "outline" | "rust"> = {
  positive: "sage",
  neutral: "outline",
  negative: "rust",
};

export function SentimentBadge({
  label,
  score,
}: {
  label: SentimentLabel;
  score?: number;
}) {
  return (
    <Badge tone={TONE[label]}>
      {label}
      {typeof score === "number" && (
        <span className="font-mono text-[10px] opacity-70 normal-case tracking-normal">
          {score > 0 ? "+" : ""}
          {score.toFixed(2)}
        </span>
      )}
    </Badge>
  );
}
