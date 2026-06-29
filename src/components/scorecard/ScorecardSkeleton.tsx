"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

const STAGES = [
  "Parsing JSON schema…",
  "Scoring purpose & guidelines…",
  "Checking argument grounding…",
  "Searching similar tools (pgvector)…",
];

function Section({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function ScorecardSkeleton() {
  return (
    <div className="space-y-6">
      <Section delay={0}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <CyclingStatus />
        </div>
      </Section>

      {/* Gauge */}
      <Section delay={0.1}>
        <div className="flex flex-col items-center gap-3 py-2">
          <Skeleton className="aspect-square w-[220px] rounded-full" />
          <Skeleton className="h-3 w-40" />
        </div>
      </Section>

      {/* Axes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Section key={i} delay={0.5 + i * 0.18}>
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </Section>
        ))}
      </div>

      {/* Fix + similar */}
      <Section delay={1.4}>
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </Section>
      <Section delay={1.8}>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </Section>
    </div>
  );
}

function CyclingStatus() {
  return (
    <span className="relative inline-block h-5 overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: 0 }}
        animate={{ y: [0, -20, -40, -60] }}
        transition={{
          duration: 2.5,
          times: [0, 0.33, 0.66, 1],
          ease: "easeInOut",
        }}
      >
        {STAGES.map((s) => (
          <span key={s} className="block h-5 leading-5">
            {s}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
