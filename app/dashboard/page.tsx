"use client";

import React from 'react';
import { MarketOverview } from "@/components/market-overview";
import { CoinList } from "@/components/coin-list";
import NewsComponent from "@/components/news-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivitySquare} from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-6 space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Comprehensive market analysis, news, and real-time updates
                </p>
            </div>

            {/* Market Overview Grid */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    <MarketOverview compact/>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
                {/* Left Column - Coin List */}
                <div className="lg:col-span-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Markets</CardTitle>
                            <CardDescription>
                                Real-time cryptocurrency market data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CoinList/>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - News Tabs */}
                <div className="lg:col-span-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Market News</CardTitle>
                            <CardDescription>
                                Latest updates and announcements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="twitter" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                                    <TabsTrigger value="news">News</TabsTrigger>
                                </TabsList>
                                <TabsContent value="twitter">
                                    <div className="h-[600px] overflow-y-auto">
                                        <NewsComponent
                                            type="twitter"
                                            title="Twitter Updates"
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="news">
                                    <div className="h-[600px] overflow-y-auto">
                                        <NewsComponent
                                            type="block"
                                            title="Block News"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}