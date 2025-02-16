"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getCryptoAnalysis } from "@/lib/gemini";
import { MessageSquare } from "lucide-react";

export function AIAgentSection() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const analysis = await getCryptoAnalysis(input);
    setResponse(analysis);
    setLoading(false);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>AI Crypto Analyst</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about market trends, token analysis, or trading strategies..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Ask"}
            </Button>
          </div>
          
          {response && (
            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}