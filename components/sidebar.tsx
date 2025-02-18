"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    BarChart2,
    MessageSquare,
    Zap,
    ChevronLeft,
    ChevronRight,
    ActivityIcon,
    ChartCandlestick
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    {
        title: "Dashboard",
        icon: Home,
        href: "/dashboard",
    },
    {
        title: "Technical Analysis",
        icon: BarChart2,
        href: "/dashboard/technical-analysis",
    },
    {
        title: "AI Agent",
        icon: MessageSquare,
        href: "/dashboard/chat",
    },
    {
        title: "Twitter Tracker",
        icon: ActivityIcon,
        href: "/dashboard/twitter-tracker",
    },
    {
        title: "Block News",
        icon: ChartCandlestick,
        href: "/dashboard/news",
    },
];

interface SidebarProps {
    isExpanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
}

export function Sidebar({ isExpanded=true, onExpandedChange }: SidebarProps) {
    const pathname = usePathname();

    useEffect(() => {
        const checkScreenSize = () => {
            const isSmallScreen = window.innerWidth < 1024;
            if (isSmallScreen) {
                onExpandedChange(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [onExpandedChange]);

    return (
        <>
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r transition-all duration-300",
                    isExpanded ? "w-64" : "w-16"
                )}
            >
                {/* Header */}
                <Link href={"/"}>
                    <div className={cn(
                        "flex h-16 items-center border-b",
                        isExpanded ? "px-6" : "justify-center"
                    )}>
                        {/*<Zap className="h-6 w-6 text-primary shrink-0" />*/}
                        <img src={'/fav.png'} alt={"Alpaco"} className="h-6 w-6 text-primary shrink-0"/>
                        {isExpanded && (
                            <h1 className="ml-2 text-2xl font-bold tracking-tight truncate">
                                Alpaco
                            </h1>
                        )}
                    </div>
                </Link>

                {/* Main Menu */}
                <div className="flex-1 overflow-auto py-4">
                    <nav className={cn(
                        "space-y-1",
                        isExpanded ? "px-4" : "px-2"
                    )}>
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={!isExpanded ? item.title : undefined}
                                className={cn(
                                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    !isExpanded && "justify-center",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {isExpanded && <span className="ml-2">{item.title}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Floating Collapse Toggle */}
            <button
                onClick={() => onExpandedChange(!isExpanded)}
                className={cn(
                    "fixed z-50 flex items-center justify-center w-5 h-5 rounded-full bg-white border shadow-sm hover:bg-gray-50 transition-all duration-300",
                    "bottom-[74px]", // Position below header
                    isExpanded ? "left-[248px]" : "left-[56px]" // Align with sidebar width
                )}
                title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
                {isExpanded ? (
                    <ChevronLeft className="h-3 w-3" />
                ) : (
                    <ChevronRight className="h-3 w-3" />
                )}
            </button>
        </>
    );
}