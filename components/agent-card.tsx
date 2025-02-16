"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AgentType, AGENT_CONFIGS } from "@/lib/agents";

interface AgentCardProps {
  type: AgentType;
  onClick: (type: AgentType) => void;
}

export function AgentCard({ type, onClick }: AgentCardProps) {
  const config = AGENT_CONFIGS[type];
  
  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onClick(type)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {config.title}
        </CardTitle>
        {config.isPremium && (
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
            PREMIUM
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {config.description}
        </p>
      </CardContent>
    </Card>
  );
}