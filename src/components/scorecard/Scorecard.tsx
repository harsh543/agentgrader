"use client";

import { motion } from "framer-motion";
import { Database } from "lucide-react";

import type { ToolGrade } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "./ScoreGauge";
import { AxisCard } from "./AxisCard";
import { SuggestedFix } from "./SuggestedFix";
import { SimilarTools } from "./SimilarTools";
import { HistorySparkline } from "./HistorySparkline";

function Divider() {
  return <div className="h-px w-full bg-border" />;
}

export function Scorecard({ grade }: { grade: ToolGrade }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-7"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-base font-semibold">
            {grade.tool_name}
          </h2>
          <Badge variant="secondary" className="capitalize">
            {grade.app}
          </Badge>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        <ScoreGauge score={grade.overall_score} verdict={grade.overall_verdict} />
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Database className="size-3" />
          Graded in 1.8s · Aurora PostgreSQL + pgvector
        </p>
      </div>

      <Divider />

      {/* Axes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {grade.axes.map((axis, i) => (
          <AxisCard
            key={axis.axis}
            axis={axis}
            index={i}
            isNew={axis.axis === "Argument Grounding"}
          />
        ))}
      </div>

      <Divider />

      <SuggestedFix />

      <Divider />

      <SimilarTools tools={grade.similar} />

      <Divider />

      <HistorySparkline data={grade.history} />
    </motion.div>
  );
}
