"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-6">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens..."
              className="pl-8"
            />
          </div>
        </div>
      </div>
    </header>
  );
}