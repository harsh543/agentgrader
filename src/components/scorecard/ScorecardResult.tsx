"use client";

import { use } from "react";

import type { ToolGrade } from "@/lib/types";
import { Scorecard } from "./Scorecard";

/**
 * Suspends on the single grade promise. Swapping the mock in lib/grade.ts
 * for the Aurora-backed route requires no change here.
 */
export function ScorecardResult({
  promise,
}: {
  promise: Promise<ToolGrade>;
}) {
  const grade = use(promise);
  return <Scorecard grade={grade} />;
}
