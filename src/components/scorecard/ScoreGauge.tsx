"use client";

import * as React from "react";
import {
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

import { toneForScore, TONE } from "@/lib/score";

function useCountUp(target: number, duration = 1200, start = true) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!start) return;
    let raf = 0;
    let startTs: number | null = null;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = ts - startTs;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}

export function ScoreGauge({
  score,
  verdict,
}: {
  score: number;
  verdict: string;
}) {
  const tone = toneForScore(score);
  const color = TONE[tone].hex;
  const count = useCountUp(score, 1200);

  const data = [{ name: "score", value: score, fill: color }];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="78%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={14}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: "var(--muted)" }}
            dataKey="value"
            cornerRadius={999}
            angleAxisId={0}
            isAnimationActive
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-end gap-0.5">
          <span
            className="text-6xl font-bold tabular-nums tracking-tight"
            style={{ color }}
          >
            {count}
          </span>
          <span className="mb-2 text-lg font-medium text-muted-foreground">
            /100
          </span>
        </div>
        <span
          className={`mt-1 text-sm font-semibold ${TONE[tone].text}`}
        >
          {verdict}
        </span>
      </div>
    </div>
  );
}
