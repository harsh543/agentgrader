import type { Verdict } from "./types";

export type ScoreTone = "green" | "amber" | "red";

export function toneForScore(score: number): ScoreTone {
  if (score >= 85) return "green";
  if (score >= 60) return "amber";
  return "red";
}

export function verdictTone(verdict: Verdict): ScoreTone {
  if (verdict === "pass") return "green";
  if (verdict === "partial") return "amber";
  return "red";
}

/** One shared color scale across gauge / pills / badges / bars. */
export const TONE: Record<
  ScoreTone,
  { hex: string; text: string; bar: string; soft: string; ring: string }
> = {
  green: {
    hex: "#34d399",
    text: "text-emerald-400",
    bar: "bg-emerald-400",
    soft: "bg-emerald-500/15",
    ring: "ring-emerald-500/30",
  },
  amber: {
    hex: "#fbbf24",
    text: "text-amber-400",
    bar: "bg-amber-400",
    soft: "bg-amber-500/15",
    ring: "ring-amber-500/30",
  },
  red: {
    hex: "#fb7185",
    text: "text-rose-400",
    bar: "bg-rose-400",
    soft: "bg-rose-500/15",
    ring: "ring-rose-500/30",
  },
};

export const VERDICT_LABEL: Record<Verdict, string> = {
  pass: "Pass",
  partial: "Partial",
  flag: "Flag",
};

export const VERDICT_BADGE: Record<Verdict, "pass" | "partial" | "flag"> = {
  pass: "pass",
  partial: "partial",
  flag: "flag",
};
