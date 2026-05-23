import type { RiskLevel } from "@/lib/types";
import { Badge } from "../ui/badge";

const LABEL: Record<RiskLevel, string> = {
  low: "Healthy",
  medium: "At-risk",
  high: "Critical",
};

const TONE: Record<RiskLevel, "sage" | "rust" | "brick"> = {
  low: "sage",
  medium: "rust",
  high: "brick",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge tone={TONE[level]}>{LABEL[level]}</Badge>;
}
