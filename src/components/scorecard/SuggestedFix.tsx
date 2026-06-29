"use client";

import { Wand2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type LineKind = "ctx" | "del" | "add";
interface Line {
  kind: LineKind;
  text: string;
}

const BEFORE: Line[] = [
  { kind: "ctx", text: '"requester_id": {' },
  { kind: "ctx", text: '  "type": "integer",' },
  { kind: "del", text: '  "description": "The numeric ID of the requester."' },
  { kind: "ctx", text: "}" },
];

const AFTER: Line[] = [
  { kind: "ctx", text: '"requester_id": {' },
  { kind: "ctx", text: '  "type": "integer",' },
  { kind: "add", text: '  "description": "The numeric ID of the requester.' },
  { kind: "add", text: "   Obtain this by first calling search_zendesk_contact" },
  { kind: "add", text: "   with the requester’s email. Never invent or guess an ID;" },
  { kind: "add", text: '   if no contact is found, ask the user instead."' },
];

function CodeBlock({ lines }: { lines: Line[] }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs leading-relaxed">
      <code>
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2 px-1",
              line.kind === "del" && "bg-rose-500/10 text-rose-300",
              line.kind === "add" && "bg-emerald-500/10 text-emerald-300",
              line.kind === "ctx" && "text-muted-foreground"
            )}
          >
            <span className="select-none opacity-50">
              {line.kind === "del" ? "-" : line.kind === "add" ? "+" : " "}
            </span>
            <span className="whitespace-pre">{line.text}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}

export function SuggestedFix() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Wand2 className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Suggested fix</h3>
        <span className="text-xs text-muted-foreground">
          Add provenance guidance to <code className="text-foreground">requester_id</code>
        </span>
      </div>

      <Tabs defaultValue="after">
        <TabsList>
          <TabsTrigger value="before">Before</TabsTrigger>
          <TabsTrigger value="after">After</TabsTrigger>
        </TabsList>
        <TabsContent value="before">
          <CodeBlock lines={BEFORE} />
        </TabsContent>
        <TabsContent value="after">
          <CodeBlock lines={AFTER} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
