import { NextResponse } from "next/server";

import { getPool } from "@/lib/db";
import { embed, toVectorLiteral } from "@/lib/embed";
import { parseTool, gradeAxes } from "@/lib/grader";
import type { HistoryPoint, SimilarTool, ToolGrade } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Grade an MCP tool against Amazon Aurora PostgreSQL + pgvector.
 *  1. Parse + heuristically grade the schema (4 axes).
 *  2. Persist the run to `grade_runs` (powers the real history sparkline).
 *  3. pgvector cosine search over the `tools` corpus for "Similar tools".
 * POST /api/grade  { input: string }
 */
export async function POST(req: Request) {
  try {
    const { input } = (await req.json()) as { input?: string };
    if (!input || !input.trim()) {
      return NextResponse.json({ error: "Empty input" }, { status: 400 });
    }

    let parsed;
    try {
      parsed = parseTool(input);
    } catch {
      return NextResponse.json(
        { error: "Could not parse JSON schema. Paste a valid MCP tool definition." },
        { status: 422 }
      );
    }

    const { axes, overall_score, overall_verdict } = gradeAxes(parsed);
    const pool = getPool();

    // 2. Persist this run.
    await pool.query(
      `INSERT INTO grade_runs (tool_name, app, overall_score, overall_verdict, axes)
       VALUES ($1, $2, $3, $4, $5::jsonb)`,
      [parsed.tool_name, parsed.app, overall_score, overall_verdict, JSON.stringify(axes)]
    );

    // 3. Real pgvector nearest-neighbour search (exclude the tool itself).
    const vec = toVectorLiteral(embed(input));
    const similarRes = await pool.query(
      `SELECT tool_name, app, 1 - (embedding <=> $1::vector) AS similarity
         FROM tools
        WHERE tool_name <> $2
        ORDER BY embedding <=> $1::vector
        LIMIT 3`,
      [vec, parsed.tool_name]
    );
    const similar: SimilarTool[] = similarRes.rows.map((r) => ({
      tool_name: r.tool_name,
      app: r.app,
      similarity: Math.max(0, Math.min(1, Number(r.similarity))),
    }));

    // History from real prior runs of this tool (oldest → newest).
    const histRes = await pool.query(
      `SELECT overall_score AS score
         FROM grade_runs
        WHERE tool_name = $1
        ORDER BY created_at DESC
        LIMIT 6`,
      [parsed.tool_name]
    );
    const scores = histRes.rows.map((r) => Number(r.score)).reverse();
    const history: HistoryPoint[] = scores.map((score, i) => ({
      run: `r${i + 1}`,
      score,
    }));

    const grade: ToolGrade = {
      tool_name: parsed.tool_name,
      app: parsed.app,
      overall_score,
      overall_verdict,
      axes,
      similar,
      history,
    };

    return NextResponse.json(grade);
  } catch (err) {
    console.error("[/api/grade] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Grading failed" },
      { status: 500 }
    );
  }
}
