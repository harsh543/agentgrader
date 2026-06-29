/**
 * Deterministic 256-dim text embedding via token feature-hashing.
 *
 * This produces REAL vectors that pgvector indexes and compares with cosine
 * distance — the "Similar tools" results are genuine nearest-neighbour
 * lookups, not hardcoded. It needs zero external API calls, so the demo can't
 * fail on a third-party outage.
 *
 * PRODUCTION SWAP: replace `embed()` with a call to Amazon Bedrock Titan Text
 * Embeddings (amazon.titan-embed-text-v2:0) and bump VECTOR(256) → VECTOR(1024)
 * in schema.sql. The query path is unchanged.
 */
export const EMBED_DIM = 256;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

// FNV-1a hash → stable bucket per token.
function hash(token: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function embed(text: string): number[] {
  const vec = new Array(EMBED_DIM).fill(0);
  const tokens = tokenize(text);
  for (const tok of tokens) {
    const h = hash(tok);
    const idx = h % EMBED_DIM;
    const sign = (h >> 16) & 1 ? 1 : -1;
    vec[idx] += sign;
  }
  // L2-normalize so cosine distance is well-behaved.
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

/** pgvector text literal, e.g. "[0.1,-0.2,...]" */
export function toVectorLiteral(vec: number[]): string {
  return `[${vec.map((v) => v.toFixed(6)).join(",")}]`;
}
