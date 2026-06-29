"use client";

import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="size-5 rounded-md bg-gradient-brand shadow-sm shadow-primary/40" />
          <span className="text-sm font-semibold tracking-tight">
            Agent<span className="text-gradient">Grader</span>
          </span>
          <span className="ml-2 hidden rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground sm:inline">
            beta
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-muted-foreground"
          >
            <span className="size-4 rounded bg-gradient-brand" />
            <span className="hidden sm:inline">Acme Inc</span>
            <ChevronsUpDown className="size-3.5 opacity-60" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-gradient-brand text-white">
              HB
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
