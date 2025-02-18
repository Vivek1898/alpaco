"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {
    Home,
    BarChart2,
    MessageSquare,
    Settings,
    LogOut,
    Zap,
    ZapIcon,
    ActivityIcon,
    ChartCandlestick,
} from "lucide-react";
import {cn} from "@/lib/utils";

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


const bottomMenuItems = [
    {
        title: "Settings",
        icon: Settings,
        href: "/settings",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <Link href={"/"}>
                <div className="flex h-16 items-center border-b px-6 gap-2">
                    <Zap className="h-6 w-6 text-primary "/>

                    <h1 className="text-2xl font-bold tracking-tigh">Alpaco</h1>


                </div>
            </Link>

            <div className="flex-1 overflow-auto py-4">
                <nav className="space-y-1 px-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            <item.icon className="h-5 w-5"/>
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/*<div className="border-t p-4">*/}
            {/*  <nav className="space-y-1">*/}
            {/*    {bottomMenuItems.map((item) => (*/}
            {/*      <Link*/}
            {/*        key={item.href}*/}
            {/*        href={item.href}*/}
            {/*        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"*/}
            {/*      >*/}
            {/*        <item.icon className="h-5 w-5" />*/}
            {/*        <span>{item.title}</span>*/}
            {/*      </Link>*/}
            {/*    ))}*/}
            {/*    <button className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">*/}
            {/*      <LogOut className="h-5 w-5" />*/}
            {/*      <span>Log Out</span>*/}
            {/*    </button>*/}
            {/*  </nav>*/}
            {/*</div>*/}
        </div>
    );
}