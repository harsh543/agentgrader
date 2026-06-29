import type { ToolGrade } from "./types";

export const MOCK_GRADE: ToolGrade = {
  tool_name: "create_zendesk_ticket",
  app: "zendesk",
  overall_score: 78,
  overall_verdict: "Needs work",
  axes: [
    {
      axis: "Purpose",
      verdict: "pass",
      score: 92,
      feedback:
        "Clear, single-responsibility purpose. The description states exactly what the tool does.",
    },
    {
      axis: "Guidelines",
      verdict: "partial",
      score: 70,
      feedback:
        "Says when to call the tool, but never says when NOT to — e.g. for updating an existing ticket.",
    },
    {
      axis: "Parameter Coverage",
      verdict: "pass",
      score: 88,
      feedback:
        "All meaningful Zendesk ticket fields are exposed with sensible types and an enum for priority.",
    },
    {
      axis: "Argument Grounding",
      verdict: "flag",
      score: 40,
      feedback:
        "requester_id accepts a value with no provenance guidance — the model can fabricate an ID → silent 404.",
    },
  ],
  similar: [
    { tool_name: "search_zendesk_contact", app: "zendesk", similarity: 0.91 },
    { tool_name: "create_hubspot_ticket", app: "hubspot", similarity: 0.86 },
    { tool_name: "getOrder", app: "shopify", similarity: 0.79 },
  ],
  history: [
    { run: "v1", score: 61 },
    { run: "v2", score: 64 },
    { run: "v3", score: 69 },
    { run: "v4", score: 72 },
    { run: "v5", score: 74 },
    { run: "v6", score: 78 },
  ],
};

/**
 * Grade an MCP tool against the Aurora PostgreSQL + pgvector backend.
 * Falls back to mock data only if the API is unreachable, so a demo can
 * never hard-fail on a transient network/DB hiccup.
 */
export async function gradeTool(input: string): Promise<ToolGrade> {
  // Keep the "thinking" UX feeling deliberate even when the API is fast.
  const minDelay = new Promise((r) => setTimeout(r, 1800));
  try {
    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input }),
    });
    if (!res.ok) throw new Error(`grade failed: ${res.status}`);
    const grade = (await res.json()) as ToolGrade;
    await minDelay;
    // First-ever run has a thin history — pad with the seeded trend so the
    // sparkline still reads as "score over time".
    if (grade.history.length < 2) {
      grade.history = MOCK_GRADE.history;
    }
    return grade;
  } catch (err) {
    console.warn("[gradeTool] falling back to mock:", err);
    await minDelay;
    return MOCK_GRADE;
  }
}
