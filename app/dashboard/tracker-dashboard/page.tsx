"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketData, useHistoricalData } from '@/lib/api';
import { CryptoChart } from '@/components/crypto-chart';
import { CryptoTable, cryptoColumns } from '@/components/crypto-table';
import { MarketStats } from '@/components/market-stats';
import { GainersLosersView } from '@/components/gainers-losers-view';
import { AirdropsView } from '@/components/airdrops-view';
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
    ExternalLink,
    Coins
} from 'lucide-react';
import { formatDistanceToNow, isValid } from 'date-fns';
import { cn, formatNumber } from '@/lib/utils';

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

const chartOptions = [
    { value: 'price', label: 'Price' },
    { value: 'volume', label: 'Volume' },
    { value: 'market_cap', label: 'Market Cap' }
];

export default function DashboardPage() {
    const { data, isLoading, error } = useMarketData();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedChart, setSelectedChart] = useState('price');
    const [selectedCoin, setSelectedCoin] = useState('BTC');

    const { data: historicalData, isLoading: isHistoricalLoading } = useHistoricalData(selectedCoin);

    const getFearAndGreedColor = (value: number) => {
        if (value >= 75) return 'text-green-500';
        if (value >= 50) return 'text-yellow-500';
        if (value >= 25) return 'text-orange-500';
        return 'text-red-500';
    };

    const getAvailableCoins = () => {
        if (!data?.latestListings) return [];
        return data.latestListings.map((coin: any) => ({
            value: coin.symbol,
            label: coin.name,
            symbol: coin.symbol
        }));
    };

    const getChartData = () => {
        if (!historicalData?.[selectedCoin]?.[0]?.quotes) return [];

        return historicalData[selectedCoin][0].quotes.map((quote: any) => ({
            time: new Date(quote.timestamp).getTime() / 1000,
            value: selectedChart === 'price' ? quote.quote.USD.price :
                selectedChart === 'volume' ? quote.quote.USD.volume_24h :
                    quote.quote.USD.market_cap
        }));
    };

    const getCurrentPrice = () => {
        if (!data?.latestListings) return null;
        const coin = data.latestListings.find((c: any) => c.symbol === selectedCoin);
        if (!coin) return null;

        return {
            price: coin.quote.USD.price,
            change: coin.quote.USD.percent_change_24h
        };
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

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="gainers-losers">Gainers & Losers</TabsTrigger>
                    <TabsTrigger value="airdrops">Airdrops</TabsTrigger>
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
                                                {data.fearAndGreed.timestamp && isValid(new Date(data.fearAndGreed.timestamp)) && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Updated {formatDistanceToNow(new Date(data.fearAndGreed.timestamp), { addSuffix: true })}
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Market Overview */}
                            <motion.div variants={itemVariants} className="col-span-2">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="flex items-center gap-2">
                                                <Activity className="h-5 w-5" />
                                                {data?.latestListings?.find((c: any) => c.symbol === selectedCoin)?.name || 'Loading...'} Chart
                                            </CardTitle>
                                            {!isLoading && getCurrentPrice() && (
                                                <div className="flex items-center gap-2">
                          <span className="text-lg font-medium">
                            ${formatNumber(getCurrentPrice()!.price)}
                          </span>
                                                    <span className={cn(
                                                        "text-sm",
                                                        getCurrentPrice()!.change >= 0 ? "text-green-500" : "text-red-500"
                                                    )}>
                            {getCurrentPrice()!.change >= 0 ? '+' : ''}{getCurrentPrice()!.change.toFixed(2)}%
                          </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select coin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getAvailableCoins().map((coin:any) => (
                                                        <SelectItem key={coin.value} value={coin.value}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{coin.label}</span>
                                                                <Badge variant="secondary">{coin.symbol}</Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Select value={selectedChart} onValueChange={setSelectedChart}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select chart type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {chartOptions.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading || isHistoricalLoading ? (
                                            <Skeleton className="h-[300px] w-full" />
                                        ) : historicalData ? (
                                            <CryptoChart
                                                data={getChartData()}
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

                            {/* Latest Airdrops */}
                            <motion.div variants={itemVariants}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gift className="h-5 w-5" />
                                            Latest Airdrops
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading ? (
                                            <ListingsSkeleton />
                                        ) : data.airdrops ? (
                                            <div className="space-y-4">
                                                {data.airdrops.slice(0, 5).map((airdrop: any) => (
                                                    <div key={airdrop.id} className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{airdrop.project_name}</span>
                                                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-muted-foreground">
                                    {airdrop.coin.name}
                                  </span>
                                                                    <Badge variant="secondary">{airdrop.coin.symbol}</Badge>
                                                                </div>
                                                            </div>
                                                            <Badge>{airdrop.status}</Badge>
                                                        </div>
                                                        {airdrop.end_date && isValid(new Date(airdrop.end_date)) && (
                                                            <div className="text-sm text-muted-foreground">
                                                                Ends {formatDistanceToNow(new Date(airdrop.end_date), { addSuffix: true })}
                                                            </div>
                                                        )}
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
                    <GainersLosersView
                        data={data.trendingGainersLosers}
                        isLoading={isLoading}
                        timeWindow="24h"
                    />
                </TabsContent>

                <TabsContent value="airdrops">
                    <AirdropsView
                        data={data.airdrops}
                        isLoading={isLoading}
                    />
                </TabsContent>
            </Tabs>
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
                <div key={i} className="flex flex-col gap-2 p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-48" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                </div>
            ))}
        </div>
    );
}