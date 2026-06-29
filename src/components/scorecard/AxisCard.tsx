"use client";

import { motion } from "framer-motion";
import { Check, MinusCircle, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AxisGrade } from "@/lib/types";
import { TONE, VERDICT_BADGE, VERDICT_LABEL, verdictTone } from "@/lib/score";

const ICON = {
  pass: Check,
  partial: MinusCircle,
  flag: AlertTriangle,
} as const;

export function AxisCard({
  axis,
  index,
  isNew = false,
}: {
  axis: AxisGrade;
  index: number;
  isNew?: boolean;
}) {
  const tone = verdictTone(axis.verdict);
  const Icon = ICON[axis.verdict];
  const delay = index * 0.05; // stagger bars 50ms apart

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm",
        axis.verdict === "flag" && "ring-1 " + TONE[tone].ring
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("grid size-6 place-items-center rounded-md", TONE[tone].soft)}>
            <Icon className={cn("size-3.5", TONE[tone].text)} />
          </span>
          <h4 className="text-sm font-semibold">{axis.axis}</h4>
          {isNew && (
            <Badge variant="new" className="px-1.5 py-0 text-[10px] uppercase tracking-wide">
              New
            </Badge>
          )}
        </div>
        <Badge variant={VERDICT_BADGE[axis.verdict]}>
          {VERDICT_LABEL[axis.verdict]}
        </Badge>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className={cn("h-full rounded-full", TONE[tone].bar)}
            initial={{ width: 0 }}
            animate={{ width: `${axis.score}%` }}
            transition={{ delay: delay + 0.1, duration: 0.7, ease: "easeOut" }}
          />
        </div>
        <span className={cn("w-9 text-right text-xs font-semibold tabular-nums", TONE[tone].text)}>
          {axis.score}
        </span>
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
        {axis.feedback}
      </p>
    </motion.div>
  );
}
