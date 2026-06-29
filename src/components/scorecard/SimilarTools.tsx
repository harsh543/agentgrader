"use client";

import { motion } from "framer-motion";
import { Boxes } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SimilarTool } from "@/lib/types";

const APP_DOT: Record<string, string> = {
  zendesk: "bg-emerald-400",
  hubspot: "bg-orange-400",
  shopify: "bg-lime-400",
};

export function SimilarTools({ tools }: { tools: SimilarTool[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Boxes className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Similar tools</h3>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help text-xs text-muted-foreground underline decoration-dotted underline-offset-2">
                Found via vector similarity
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Powered by pgvector on Amazon Aurora PostgreSQL.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tools.map((tool, i) => {
          const pct = Math.round(tool.similarity * 100);
          return (
            <motion.div
              key={tool.tool_name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              className="group rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    APP_DOT[tool.app] ?? "bg-zinc-400"
                  )}
                />
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary tabular-nums">
                  {pct}%
                </span>
              </div>
              <p className="mt-2 truncate font-mono text-xs font-medium">
                {tool.tool_name}
              </p>
              <p className="mt-0.5 text-[11px] capitalize text-muted-foreground">
                {tool.app}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
