import React from 'react';
import { CoinGeckoMarket } from '../types/dex';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface MarketOverviewProps {
    topGainers: CoinGeckoMarket[];
    topLosers: CoinGeckoMarket[];
    isLoading: boolean;
}

const MarketGainLossOverview: React.FC<MarketOverviewProps> = ({ topGainers, topLosers, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                    <h2 className="text-lg font-semibold">Top Gainers (24h)</h2>
                </div>
                <div className="space-y-3">
                    {topGainers.slice(0, 5).map((coin) => (
                        <div key={coin.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                                <span className="font-medium">{coin.symbol.toUpperCase()}</span>
                            </div>
                            <span className="text-green-500">
                +{coin.price_change_percentage_24h.toFixed(2)}%
              </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                    <h2 className="text-lg font-semibold">Top Losers (24h)</h2>
                </div>
                <div className="space-y-3">
                    {topLosers.slice(0, 5).map((coin) => (
                        <div key={coin.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                                <span className="font-medium">{coin.symbol.toUpperCase()}</span>
                            </div>
                            <span className="text-red-500">
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketGainLossOverview;