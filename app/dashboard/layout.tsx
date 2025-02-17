"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { cn } from "@/lib/utils";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    const [isExpanded, setIsExpanded] = useState(false); // Start collapsed

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                isExpanded={isExpanded}
                onExpandedChange={setIsExpanded}
            />
            <main
                className={cn(
                    "flex-1 overflow-auto transition-all duration-300",
                    "p-4 md:p-6 lg:p-8",
                    isExpanded ? "ml-64" : "ml-16"
                )}
            >
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}