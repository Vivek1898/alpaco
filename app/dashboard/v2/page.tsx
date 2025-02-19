"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useMarketData } from '@/lib/api';
import { CryptoChart } from '@/components/crypto-chart';
import { CryptoTable, cryptoColumns } from '@/components/crypto-table';
import { MarketStats } from '@/components/market-stats';
import { GainersLosersView } from '@/components/gainers-losers-view';
import {
    Activity,
    TrendingUp,
    Gauge,
    Gift,
    BarChart2,
    Map,
    Info,
    Zap,
    Eye,
    ArrowUpDown,
    Clock,
    Calendar,
    ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn, formatNumber } from '@/lib/utils';
import DashboardContainer from "@/modules/dashboard/container/dashboard.container";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function DashboardPageV2() {
    const { data, isLoading, error } = useMarketData();
    const [activeTab, setActiveTab] = useState('overview');

    const getFearAndGreedColor = (value: number) => {
        if (value >= 75) return 'text-green-500';
        if (value >= 50) return 'text-yellow-500';
        if (value >= 25) return 'text-orange-500';
        return 'text-red-500';
    };

    const formatTimeAgo = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold mb-2">Crypto Market Dashboard</h1>
                <p className="text-muted-foreground">
                    Comprehensive overview of the cryptocurrency market
                </p>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="gainers-losers">Gainers & Losers</TabsTrigger>
                    <TabsTrigger value="historical">Historical</TabsTrigger>
                    <TabsTrigger value="fear-greed">Fear & Greed</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        {/* Global Market Stats */}
                        <motion.div variants={itemVariants}>
                            <MarketStats data={data.globalMetrics} isLoading={isLoading} />
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {/* Fear & Greed Index */}
                            <motion.div variants={itemVariants}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gauge className="h-5 w-5" />
                                            Fear & Greed Index
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading ? (
                                            <FearAndGreedSkeleton />
                                        ) : data.fearAndGreed ? (
                                            <div className="text-center">
                                                <div className={cn(
                                                    "text-4xl font-bold mb-2",
                                                    getFearAndGreedColor(data.fearAndGreed.value)
                                                )}>
                                                    {data.fearAndGreed.value}
                                                </div>
                                                <div className="text-lg font-medium mb-1">
                                                    {data.fearAndGreed.value_classification}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Updated {formatTimeAgo(data.fearAndGreed.timestamp)}
                                                </div>
                                            </div>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Market Overview */}
                            <motion.div variants={itemVariants} className="col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="h-5 w-5" />
                                            Bitcoin Price Chart
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading ? (
                                            <Skeleton className="h-[300px] w-full" />
                                        ) : data.historicalData ? (
                                            <CryptoChart
                                                data={data.historicalData}
                                                colors={{
                                                    backgroundColor: 'white',
                                                    lineColor: '#22c55e',
                                                    textColor: '#1f2937',
                                                    areaTopColor: '#22c55e',
                                                    areaBottomColor: 'rgba(34, 197, 94, 0.2)',
                                                }}
                                            />
                                        ) : (
                                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                                No chart data available
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Top Gainers */}
                            <motion.div variants={itemVariants}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Top Gainers
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading ? (
                                            <ListingsSkeleton />
                                        ) : data.trendingGainersLosers ? (
                                            <div className="space-y-4">
                                                {data.trendingGainersLosers
                                                    .filter((coin: any) => coin.quote.USD.percent_change_24h > 0)
                                                    .slice(0, 5)
                                                    .map((coin: any) => (
                                                        <div key={coin.id} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{coin.name}</span>
                                                                <Badge variant="secondary">{coin.symbol}</Badge>
                                                            </div>
                                                            <span className="text-green-500">
                                +{coin.quote.USD.percent_change_24h.toFixed(2)}%
                              </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Top Losers */}
                            <motion.div variants={itemVariants}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ArrowUpDown className="h-5 w-5" />
                                            Top Losers
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading ? (
                                            <ListingsSkeleton />
                                        ) : data.trendingGainersLosers ? (
                                            <div className="space-y-4">
                                                {data.trendingGainersLosers
                                                    .filter((coin: any) => coin.quote.USD.percent_change_24h < 0)
                                                    .slice(0, 5)
                                                    .map((coin: any) => (
                                                        <div key={coin.id} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{coin.name}</span>
                                                                <Badge variant="secondary">{coin.symbol}</Badge>
                                                            </div>
                                                            <span className="text-red-500">
                                {coin.quote.USD.percent_change_24h.toFixed(2)}%
                              </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="market">
                    <Card>
                        <CardHeader>
                            <CardTitle>Market Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-[400px] w-full" />
                            ) : data.latestListings ? (
                                <CryptoTable
                                    columns={cryptoColumns}
                                    data={data.latestListings}
                                />
                            ) : null}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="gainers-losers">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowUpDown className="h-5 w-5" />
                                    Gainers & Losers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <GainersLosersView
                                    data={data.trendingGainersLosers}
                                    isLoading={isLoading}
                                    timeWindow="24h"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Add other tab contents */}
            </Tabs>
            <div className={'mt-10'}>
                <DashboardContainer/>
            </div>
        </div>
    );
}

function FearAndGreedSkeleton() {
    return (
        <div className="space-y-4 text-center">
            <Skeleton className="h-12 w-24 mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
        </div>
    );
}

function ListingsSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}