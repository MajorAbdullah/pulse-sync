import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  tone?: "sage" | "rust" | "brick" | "ink";
  className?: string;
  showDot?: boolean;
  showArea?: boolean;
}

const TONE_STROKE: Record<NonNullable<SparklineProps["tone"]>, string> = {
  sage: "var(--color-sage)",
  rust: "var(--color-rust)",
  brick: "var(--color-brick)",
  ink: "var(--color-ink)",
};
const TONE_FILL: Record<NonNullable<SparklineProps["tone"]>, string> = {
  sage: "var(--color-sage-tint)",
  rust: "var(--color-rust-tint)",
  brick: "var(--color-brick-tint)",
  ink: "var(--color-paper-2)",
};

export function Sparkline({
  data,
  width = 96,
  height = 28,
  tone,
  className,
  showDot = true,
  showArea = true,
}: SparklineProps) {
  if (!data.length) return null;

  // auto-tone from trend direction if not provided
  const trendTone: NonNullable<SparklineProps["tone"]> =
    tone ??
    (data[data.length - 1] - data[0] > 4
      ? "sage"
      : data[data.length - 1] - data[0] < -4
        ? "rust"
        : "ink");

  const padding = 2;
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data.map((v, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(2)},${(height - padding).toFixed(2)} L${points[0][0].toFixed(2)},${(height - padding).toFixed(2)} Z`;

  const last = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block", className)}
    >
      {showArea && (
        <path d={areaPath} fill={TONE_FILL[trendTone]} opacity={0.55} />
      )}
      <path d={linePath} className="spark-path" stroke={TONE_STROKE[trendTone]} />
      {showDot && (
        <circle
          cx={last[0]}
          cy={last[1]}
          r={2}
          fill={TONE_STROKE[trendTone]}
        />
      )}
    </svg>
  );
}
