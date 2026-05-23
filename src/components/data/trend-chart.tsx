"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendChartProps {
  data: number[];
  height?: number;
  /** Days back the first index represents (default: length of array). */
  startDaysAgo?: number;
}

export function TrendChart({ data, height = 220, startDaysAgo }: TrendChartProps) {
  const series = useMemo(
    () =>
      data.map((v, i) => {
        const back = (startDaysAgo ?? data.length) - i;
        const d = new Date();
        d.setDate(d.getDate() - back);
        return {
          day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: v,
        };
      }),
    [data, startDaysAgo],
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={series} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity={0.14} />
            <stop offset="100%" stopColor="var(--color-ink)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="var(--color-rule)"
          strokeDasharray="2 4"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          stroke="var(--color-ink-4)"
          tick={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, fill: "var(--color-ink-3)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--color-rule)" }}
          interval="preserveStartEnd"
          minTickGap={32}
        />
        <YAxis
          stroke="var(--color-ink-4)"
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tick={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, fill: "var(--color-ink-3)" }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip
          cursor={{ stroke: "var(--color-ink-4)", strokeDasharray: "2 2" }}
          contentStyle={{
            background: "var(--color-card)",
            border: "1px solid var(--color-rule-strong)",
            borderRadius: 4,
            fontFamily: "var(--font-manrope)",
            fontSize: 12,
            color: "var(--color-ink)",
            padding: "6px 10px",
            boxShadow: "none",
          }}
          labelStyle={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            color: "var(--color-ink-3)",
            marginBottom: 2,
          }}
          formatter={(v) => [String(v), "Pulse"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-ink)"
          strokeWidth={1.5}
          fill="url(#pulseFill)"
          dot={false}
          activeDot={{ r: 3, fill: "var(--color-ink)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
