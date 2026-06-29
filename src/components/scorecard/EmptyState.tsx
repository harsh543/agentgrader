import { Gauge } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-2xl" />
        <div className="grid size-16 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Gauge className="size-7 text-primary" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium">
        Grade a tool to see its quality score.
      </p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Paste an MCP tool JSON schema on the left and we&apos;ll score it across
        four quality axes.
      </p>
    </div>
  );
}
