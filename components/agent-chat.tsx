"use client";

import { useState } from "react";
import { AgentType, AGENT_CONFIGS, getAgentResponse } from "@/lib/agents";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AgentChatProps {
  agentType: AgentType;
  onBack: () => void;
}

interface Message {
  role: "user" | "agent";
  content: string;
}

export function AgentChat({ agentType, onBack }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const config = AGENT_CONFIGS[agentType];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await getAgentResponse(agentType, userMessage);
      setMessages(prev => [...prev, { role: "agent", content: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "agent", 
        content: "I apologize, but I encountered an error processing your request." 
      }]);
    }

    setLoading(false);
  }

  return (
    <Card className="h-[800px] flex flex-col bg-white shadow-lg rounded-lg">
      <CardHeader className="flex flex-row items-center space-x-4 border-b p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{config.title}</span>
          {config.isPremium && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              PREMIUM
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100"
                }`}
              >
                {message.role === "agent" ? (
                  <ReactMarkdown 
                    className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ children }) => (
                        <code className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5">{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-200 dark:bg-gray-800 rounded p-2 overflow-x-auto">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2 pt-2 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}