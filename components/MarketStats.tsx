"use client";

import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { coinLayerService } from "@/lib/coinlayer";

const TOP_CRYPTOS = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'LINK'];

interface MarketStats {
    volume24h: number;
    transactions24h: number;
    newPairs24h: number;
    totalMarketCap: number;
}

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </CardContent>
    </Card>
);

const DexStats = () => {
    const [stats, setStats] = useState<MarketStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAndCalculateStats = async () => {
        try {
            setIsLoading(true);
            const response = await coinLayerService.getLiveRates(TOP_CRYPTOS);

            // Calculate total market cap and volume
            let totalMarketCap = 0;
            let totalVolume = 0;

            Object.entries(response.rates).forEach(([symbol, rate]) => {
                const marketCap = rate * (symbol === 'BTC' ? 19_000_000 : 100_000_000);
                const volume = marketCap * 0.1; // Simulated volume as 10% of market cap

                totalMarketCap += marketCap;
                totalVolume += volume;
            });

            // Calculate simulated transactions based on volume
            const estimatedTransactions = Math.floor(totalVolume / 10000); // Assume average transaction size

            setStats({
                volume24h: totalVolume,
                transactions24h: estimatedTransactions,
                newPairs24h: Math.floor(Math.random() * 50) + 100, // Simulated new pairs
                totalMarketCap: totalMarketCap
            });
        } catch (error) {
            console.error('Error fetching market stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAndCalculateStats();
        const interval = setInterval(fetchAndCalculateStats, 300000); // Update every 5 minutes
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-2">
                            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
                title="Total Market Cap"
                value={`$${(stats.totalMarketCap / 1e9).toFixed(2)}B`}
                icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />}
                description="Combined value of all assets"
            />
            <StatsCard
                title="24h Volume"
                value={`$${(stats.volume24h / 1e9).toFixed(2)}B`}
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                description="Total trading volume"
            />
            <StatsCard
                title="Transactions"
                value={`${(stats.transactions24h / 1e6).toFixed(2)}M`}
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                description="24h transactions"
            />
            <StatsCard
                title="New Pairs"
                value={stats.newPairs24h.toString()}
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                description="New pairs in 24h"
            />
        </div>
    );
};

export default DexStats;