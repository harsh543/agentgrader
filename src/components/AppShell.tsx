"use client";

import * as React from "react";

import { gradeTool } from "@/lib/grade";
import type { ToolGrade } from "@/lib/types";
import { GraderPane } from "./GraderPane";
import { Card } from "./ui/card";
import { EmptyState } from "./scorecard/EmptyState";
import { ScorecardResult } from "./scorecard/ScorecardResult";
import { ScorecardSkeleton } from "./scorecard/ScorecardSkeleton";

export function AppShell() {
  // The whole right pane is driven off this single promise.
  const [promise, setPromise] = React.useState<Promise<ToolGrade> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGrade = React.useCallback((input: string) => {
    setIsLoading(true);
    const p = gradeTool(input);
    setPromise(p);
    p.finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="app-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 px-4 py-6 sm:px-6 lg:grid-cols-5">
        {/* Left pane ~40% */}
        <div className="lg:col-span-2">
          <Card className="bg-card/60 p-5 backdrop-blur-sm">
            <GraderPane onGrade={handleGrade} isLoading={isLoading} />
          </Card>
        </div>

        {/* Right pane ~60% */}
        <div className="lg:col-span-3">
          <Card className="min-h-[560px] bg-card/60 p-5 backdrop-blur-sm sm:p-6">
            {promise === null ? (
              <EmptyState />
            ) : (
              <React.Suspense fallback={<ScorecardSkeleton />}>
                <ScorecardResult promise={promise} />
              </React.Suspense>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
