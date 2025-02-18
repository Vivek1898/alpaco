import React from 'react';
import { Activity, TrendingUp, BarChart2 } from 'lucide-react';
import type { DexMarketStats } from '../types/dex';

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            {icon}
        </div>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

interface DexStatsProps {
    stats: DexMarketStats;
    isLoading: boolean;
}

const DexStats: React.FC<DexStatsProps> = ({ stats, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
                title="24H Volume"
                value={`$${(stats.volume24h / 1e9).toFixed(2)}B`}
                icon={<BarChart2 className="w-5 h-5 text-blue-500" />}
            />
            <StatsCard
                title="24H Transactions"
                value={`${(stats.transactions24h / 1e6).toFixed(2)}M`}
                icon={<Activity className="w-5 h-5 text-green-500" />}
            />
            <StatsCard
                title="New Pairs (24H)"
                value={stats.newPairs24h.toString()}
                icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
            />
        </div>
    );
};

export default DexStats;