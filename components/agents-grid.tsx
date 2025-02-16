"use client";

import { useState } from "react";
import { AgentType } from "@/lib/agents";
import { AgentCard } from "./agent-card";
import { AgentChat } from "./agent-chat";

const AGENT_TYPES: AgentType[] = [
  "sagehood",
  "news",
  "technical",
  "financial",
  "geopolitical",
  "macro",
  "risk",
  "satellite",
  "sec",
  "sector"
];

export function AgentsGrid() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
        <p className="text-muted-foreground">
          Access Domain-Specific AI-Agent Experts.
        </p>
      </div>

      {selectedAgent ? (
        <AgentChat 
          agentType={selectedAgent} 
          onBack={() => setSelectedAgent(null)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AGENT_TYPES.map((type) => (
            <AgentCard
              key={type}
              type={type}
              onClick={setSelectedAgent}
            />
          ))}
        </div>
      )}
    </div>
  );
}