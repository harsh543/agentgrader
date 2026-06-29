# AgentGrader

**The Lighthouse score for AI agent tools.**

AgentGrader grades an MCP (Model Context Protocol) tool's JSON schema for quality and shows the result as an animated scorecard — so you can ship agent tools that models actually use correctly.

🔗 **Live demo:** https://agentgrader.vercel.app

---

## What it does

Paste an MCP tool JSON schema (or an MCP server URL) and get an instant quality grade across four axes:

| Axis | What it checks |
| --- | --- |
| **Purpose** | Clear, single-responsibility description |
| **Guidelines** | Tells the model *when* and *when not* to call |
| **Parameter Coverage** | Exposes the right fields with sensible types |
| **Argument Grounding** 🆕 | Whether arguments have provenance guidance — so the model can't fabricate IDs |

Each grade comes with:
- An animated **radial gauge** (0→100, color-coded green / amber / red)
- Per-axis **progress bars + verdict pills** (pass / partial / flag)
- A **Before/After suggested fix** diff
- **Similar tools** found via vector similarity (pgvector on Amazon Aurora PostgreSQL)
- A **score-over-time** sparkline

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + shadcn-style UI primitives
- **Framer Motion** (staggered reveals, count-up gauge)
- **Recharts** (radial gauge + sparkline)
- **lucide-react** icons
- Deployed on **Vercel**

## Architecture

All grading flows through a single async function so the demo mock can be swapped for a real backend in one line:

```ts
// src/lib/grade.ts
export async function gradeTool(input: string): Promise<ToolGrade> {
  // TODO: replace with fetch('/api/grade')
  await new Promise((r) => setTimeout(r, 2500));
  return MOCK_GRADE;
}
```

The entire right-pane UI (streaming skeleton → revealed scorecard) is driven off that single promise via React `<Suspense>` + `use()`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy

```bash
vercel --prod
```

---

Built for demo. Mock data lives in `src/lib/grade.ts`.
