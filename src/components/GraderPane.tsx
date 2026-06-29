"use client";

import * as React from "react";
import { Sparkles, Link2, Command } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EXAMPLES, ZENDESK_SCHEMA } from "@/lib/examples";

export function GraderPane({
  onGrade,
  isLoading,
}: {
  onGrade: (input: string) => void;
  isLoading: boolean;
}) {
  const [schema, setSchema] = React.useState(ZENDESK_SCHEMA);
  const [url, setUrl] = React.useState("");
  const [activeExample, setActiveExample] = React.useState("zendesk");

  const grade = React.useCallback(() => {
    if (isLoading) return;
    onGrade(url.trim() ? url : schema);
  }, [isLoading, onGrade, schema, url]);

  // Cmd/Ctrl + Enter triggers grading
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      grade();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} className="flex h-full flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Paste an MCP tool JSON schema
        </label>
        <Textarea
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          spellCheck={false}
          className="min-h-[320px] resize-none font-mono text-[13px] leading-relaxed"
          placeholder="Paste an MCP tool JSON schema"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          …or paste an MCP server URL
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-9"
            placeholder="https://mcp.example.com/sse"
          />
        </div>
      </div>

      <Button
        variant="gradient"
        size="lg"
        onClick={grade}
        disabled={isLoading}
        className="w-full"
      >
        <Sparkles className={cn("size-4", isLoading && "animate-pulse")} />
        {isLoading ? "Grading…" : "Grade tool"}
        <kbd className="ml-1 hidden items-center gap-0.5 rounded border border-white/25 px-1.5 py-0.5 text-[10px] font-medium opacity-80 sm:inline-flex">
          <Command className="size-2.5" />
          ↵
        </kbd>
      </Button>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Examples</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                setSchema(ex.schema);
                setUrl("");
                setActiveExample(ex.id);
              }}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
                activeExample === ex.id
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
