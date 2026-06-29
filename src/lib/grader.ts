import type { AxisGrade, Verdict } from "./types";

export interface ParsedTool {
  tool_name: string;
  app: string;
  description: string;
  properties: Record<string, { type?: string; description?: string; enum?: unknown[] }>;
  required: string[];
  raw: unknown;
}

const ACTION_VERBS = [
  "create", "update", "get", "list", "delete", "remove", "search",
  "send", "fetch", "retrieve", "add", "set", "find", "cancel", "close",
];

const PROVENANCE_KEYWORDS = [
  "obtain", "returned by", "from a previous", "result of", "call ",
  "search ", "lookup", "look up", "use the", "first call", "fetch the",
  "id from", "do not invent", "never invent", "do not guess",
];

const WHEN_NOT_KEYWORDS = [
  "do not", "don't", "not for", "instead", "avoid", "only when",
  "rather than", "never call", "should not", "when not",
];

const ID_PARAM = /(_id$|^id$|Id$|identifier)/i;

/** Parse an MCP tool definition (supports `inputSchema` and bare `parameters`). */
export function parseTool(input: string): ParsedTool {
  const obj = JSON.parse(input) as Record<string, unknown>;
  const schema = (obj.inputSchema ?? obj.parameters ?? obj.input_schema ?? {}) as Record<string, unknown>;
  const tool_name = String(obj.name ?? "unnamed_tool");
  return {
    tool_name,
    app: inferApp(tool_name, String(obj.description ?? "")),
    description: String(obj.description ?? ""),
    properties: (schema.properties as ParsedTool["properties"]) ?? {},
    required: (schema.required as string[]) ?? [],
    raw: obj,
  };
}

function inferApp(name: string, desc: string): string {
  const hay = `${name} ${desc}`.toLowerCase();
  for (const app of ["zendesk", "hubspot", "shopify", "stripe", "slack", "salesforce", "github"]) {
    if (hay.includes(app)) return app;
  }
  return "custom";
}

function verdictFor(score: number): Verdict {
  if (score >= 85) return "pass";
  if (score >= 60) return "partial";
  return "flag";
}

function gradePurpose(t: ParsedTool): AxisGrade {
  let score = 50;
  const desc = t.description.trim();
  if (desc) score += 20;
  if (desc.length >= 20 && desc.length <= 200) score += 12;
  const firstWord = desc.toLowerCase().split(/\s+/)[0] ?? "";
  if (ACTION_VERBS.includes(firstWord)) score += 10;
  if (desc && !/ and also | and then |;/.test(desc.toLowerCase())) score += 0; // single-responsibility
  score = Math.min(100, score);
  const feedback = desc
    ? score >= 85
      ? "Clear, single-responsibility purpose. The description states exactly what the tool does."
      : "Purpose is understandable but could be sharper about the single outcome this tool produces."
    : "No description — the model has no idea what this tool is for.";
  return { axis: "Purpose", verdict: verdictFor(score), score, feedback };
}

function gradeGuidelines(t: ParsedTool): AxisGrade {
  const desc = t.description.toLowerCase();
  let score = 40;
  if (desc) score += 30; // says what / when to call
  const hasWhenNot = WHEN_NOT_KEYWORDS.some((k) => desc.includes(k));
  if (hasWhenNot) score += 30;
  score = Math.min(100, score);
  const feedback = hasWhenNot
    ? "States both when to call and when not to — the model can disambiguate from sibling tools."
    : "Says when to call the tool, but never says when NOT to — e.g. for updating an existing record.";
  return { axis: "Guidelines", verdict: verdictFor(score), score, feedback };
}

function gradeParamCoverage(t: ParsedTool): AxisGrade {
  const keys = Object.keys(t.properties);
  if (keys.length === 0) {
    return {
      axis: "Parameter Coverage",
      verdict: "flag",
      score: 30,
      feedback: "No parameters defined — the tool can't accept the inputs it needs.",
    };
  }
  const described = keys.filter((k) => (t.properties[k].description ?? "").trim().length > 0);
  const ratio = described.length / keys.length;
  const hasEnum = keys.some((k) => Array.isArray(t.properties[k].enum));
  let score = 50 + Math.round(35 * ratio) + (t.required.length > 0 ? 3 : 0) + (hasEnum ? 0 : 0);
  score = Math.min(100, score);
  const feedback =
    ratio >= 0.9
      ? "All meaningful fields are exposed with sensible types" + (hasEnum ? " and an enum for constrained values." : ".")
      : `${described.length}/${keys.length} parameters have descriptions — undocumented params get guessed.`;
  return { axis: "Parameter Coverage", verdict: verdictFor(score), score, feedback };
}

function gradeArgumentGrounding(t: ParsedTool): AxisGrade {
  const keys = Object.keys(t.properties);
  const idParams = keys.filter((k) => ID_PARAM.test(k) || /\bid\b/i.test(t.properties[k].description ?? ""));

  if (idParams.length === 0) {
    return {
      axis: "Argument Grounding",
      verdict: "pass",
      score: 90,
      feedback: "No opaque identifiers — every argument can be supplied directly from user intent.",
    };
  }

  const grounded = idParams.filter((k) => {
    const d = (t.properties[k].description ?? "").toLowerCase();
    return PROVENANCE_KEYWORDS.some((kw) => d.includes(kw));
  });
  const ratio = grounded.length / idParams.length;
  const score = Math.min(100, Math.round(40 + 50 * ratio));

  const firstUngrounded = idParams.find((k) => !grounded.includes(k));
  const feedback = firstUngrounded
    ? `${firstUngrounded} accepts a value with no provenance guidance — the model can fabricate an ID → silent 404.`
    : "Every identifier tells the model where to source it from. No fabrication risk.";

  return { axis: "Argument Grounding", verdict: verdictFor(score), score, feedback };
}

const WEIGHTS: Record<string, number> = {
  Purpose: 0.3,
  Guidelines: 0.25,
  "Parameter Coverage": 0.3,
  "Argument Grounding": 0.15,
};

export function gradeAxes(t: ParsedTool): {
  axes: AxisGrade[];
  overall_score: number;
  overall_verdict: string;
} {
  const axes = [
    gradePurpose(t),
    gradeGuidelines(t),
    gradeParamCoverage(t),
    gradeArgumentGrounding(t),
  ];
  const overall_score = Math.round(
    axes.reduce((sum, a) => sum + a.score * (WEIGHTS[a.axis] ?? 0.25), 0)
  );
  const overall_verdict =
    overall_score >= 85 ? "Production-ready" : overall_score >= 60 ? "Needs work" : "Not ready";
  return { axes, overall_score, overall_verdict };
}
