export type Verdict = "pass" | "partial" | "flag";

export interface AxisGrade {
  axis: string;
  verdict: Verdict;
  score: number;
  feedback: string;
}

export interface SimilarTool {
  tool_name: string;
  app: string;
  similarity: number;
}

export interface HistoryPoint {
  run: string;
  score: number;
}

export interface ToolGrade {
  tool_name: string;
  app: string;
  overall_score: number;
  overall_verdict: string;
  axes: AxisGrade[];
  similar: SimilarTool[];
  history: HistoryPoint[];
}
