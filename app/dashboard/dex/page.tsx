"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Activity, ChartCandlestick } from "lucide-react";

interface TokenInfo {
    symbol: string;
}

interface PriceChange {
    h24: number;
}

interface Volume {
    h24: string;
}

interface Pair {
    pairAddress: string;
    chainId: string;
    baseToken: TokenInfo;
    quoteToken: TokenInfo;
    priceUsd: string;
    priceChange?: PriceChange;
    volume?: Volume;
    [key: string]: any; // Allow any additional properties
}

interface ChainData {
    [chainId: string]: {
        pairs: number;
        volume24h: number;
    }
}

const DexDashboard = () => {
    const [pairs, setPairs] = useState<Pair[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPairs = async () => {
        try {
            const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=USDC');
            const data = await response.json();
            setPairs(data.pairs || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPairs();
    }, []);

    const sortedPairs = [...pairs].sort((a, b) => {
        const aChange = a.priceChange?.h24 || 0;
        const bChange = b.priceChange?.h24 || 0;
        return bChange - aChange;
    });

    const gainers = sortedPairs.slice(0, 5);
    const losers = sortedPairs.slice(-5).reverse();

    const chainData = pairs.reduce((acc: ChainData, pair) => {
        if (!acc[pair.chainId]) {
            acc[pair.chainId] = {
                pairs: 0,
                volume24h: 0,
            };
        }
        acc[pair.chainId].pairs++;
        acc[pair.chainId].volume24h += parseFloat(pair.volume?.h24 || '0');
        return acc;
    }, {});

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Activity className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4">
                Error loading data: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-6">DEX Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowUpCircle className="text-green-500" />
                            Top Gainers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {gainers.map((pair) => (
                                <div key={pair.pairAddress} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="font-medium">{pair.baseToken.symbol}/{pair.quoteToken.symbol}</span>
                                    <span className="text-green-500">+{pair.priceChange?.h24?.toFixed(2)}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowDownCircle className="text-red-500" />
                            Top Losers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {losers.map((pair) => (
                                <div key={pair.pairAddress} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="font-medium">{pair.baseToken.symbol}/{pair.quoteToken.symbol}</span>
                                    <span className="text-red-500">{pair.priceChange?.h24?.toFixed(2)}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Chain Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(chainData).map(([chainId, data]) => (
                            <div key={chainId} className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold mb-2">{chainId.toUpperCase()}</h3>
                                <div className="space-y-2">
                                    <p>Total Pairs: {data.pairs}</p>
                                    <p>24h Volume: ${data.volume24h.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>All Pairs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Pair</th>
                                <th className="text-left p-2">Chain</th>
                                <th className="text-right p-2">Price</th>
                                <th className="text-right p-2">24h Change</th>
                                <th className="text-right p-2">Volume</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(pairs as any).map((pair: { pairAddress: React.Key | null | undefined; baseToken: { symbol: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }; quoteToken: { symbol: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }; chainId: string; priceUsd: string; priceChange: { h24: number; }; volume: { h24: any; }; }) => (
                                <tr key={pair.pairAddress} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{pair.baseToken.symbol}/{pair.quoteToken.symbol}</td>
                                    <td className="p-2">{pair.chainId.toUpperCase()}</td>
                                    <td className="text-right p-2">${parseFloat(pair.priceUsd).toFixed(6)}</td>
                                    <td className={`text-right p-2 ${pair?.priceChange?.h24 >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {pair.priceChange?.h24?.toFixed(2)}%
                                    </td>
                                    <td className="text-right p-2">${parseFloat(pair.volume?.h24 || '0').toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DexDashboard;