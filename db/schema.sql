-- AgentGrader data model — Amazon Aurora PostgreSQL + pgvector
-- Run once against the cluster (the /api/seed route does this automatically).

CREATE EXTENSION IF NOT EXISTS vector;

-- Corpus of known MCP tools. `embedding` powers "Similar tools" via pgvector.
CREATE TABLE IF NOT EXISTS tools (
  id          BIGSERIAL PRIMARY KEY,
  tool_name   TEXT NOT NULL,
  app         TEXT NOT NULL,
  schema_json JSONB NOT NULL,
  embedding   VECTOR(256) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tool_name, app)
);

-- pgvector cosine-distance index for fast nearest-neighbour similarity search.
CREATE INDEX IF NOT EXISTS tools_embedding_idx
  ON tools USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- Every grade run, so we can render the "Score over time" sparkline from real data.
CREATE TABLE IF NOT EXISTS grade_runs (
  id              BIGSERIAL PRIMARY KEY,
  tool_name       TEXT NOT NULL,
  app             TEXT NOT NULL,
  overall_score   INT NOT NULL,
  overall_verdict TEXT NOT NULL,
  axes            JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS grade_runs_tool_idx
  ON grade_runs (tool_name, created_at);
