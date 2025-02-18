"use client"

import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Activity } from 'lucide-react';

// Components imports
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import SearchBar from '@/components/SearchBar';
import SearchOverlay from '@/components/SearchOverlay';
import MarketOverview from '@/components/MarketGainLossOverview';
import TrendingTokens from '@/components/TrendingTokens';
import DexStats from '@/components/MarketStats';
import TokenProfileList from '@/components/TokenProfileList';
import NewsComponent from "@/components/news-component";
import { CoinList } from "@/components/coin-list";
import { Providers } from './providers';

// API imports
import {
    searchPairs,
    getTopTokens,
    getTokenProfiles,
    getMarketStats
} from '@/lib/dexApi';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('twitter');
    const [key, setKey] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    // Add scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { data: topTokens, isLoading: isLoadingTopTokens } = useQuery(
        'topTokens',
        getTopTokens,
        {
            refetchInterval: 30000,
        }
    );

    const { data: tokenProfiles, isLoading: isLoadingProfiles } = useQuery(
        'tokenProfiles',
        getTokenProfiles,
        {
            refetchInterval: 60000,
        }
    );

    const { data: marketStats, isLoading: isLoadingStats } = useQuery(
        'marketStats',
        getMarketStats,
        {
            refetchInterval: 30000,
        }
    );

    const { data: searchResults, isLoading: isLoadingSearch, error } = useQuery(
        ['searchPairs', searchQuery],
        () => searchPairs(searchQuery),
        {
            enabled: !!searchQuery,
        }
    );

    const handleTabChange = (tab: React.SetStateAction<string>) => {
        setActiveTab(tab);
        setKey(prevKey => prevKey + 1);
    };

    const handleSearch = (query: React.SetStateAction<string>) => {
        setSearchQuery(query);
    };

    const handleCloseSearch = () => {
        setSearchQuery('');
    };

    const topGainers = topTokens
        ?.filter((token) => token.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 5) || [];

    const topLosers = topTokens
        ?.filter((token) => token.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 5) || [];

    const trendingTokens = topTokens
        ?.sort((a, b) => b.total_volume - a.total_volume)
        .slice(0, 3) || [];

    return (
        <div className="min-h-screen container mx-auto py-6 space-y-8">

            <div className="flex justify-between items-start w-full px-4 py-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Comprehensive market analysis, news, and real-time updates
                    </p>
                </div>
                <div className="w-[450px]">
                    <SearchBar onSearch={handleSearch}/>
                </div>
            </div>

            {/* Search Overlay */}
            <SearchOverlay
                isOpen={!!searchQuery}
                onClose={handleCloseSearch}
                searchQuery={searchQuery}
                searchResults={searchResults}
                isLoading={isLoadingSearch}
                error={error}
            />

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {marketStats && <DexStats />}

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-6">
                        <MarketOverview
                            topGainers={topGainers}
                            topLosers={topLosers}
                            isLoading={isLoadingTopTokens}
                        />
                        <TrendingTokens tokens={trendingTokens} isLoading={isLoadingTopTokens}/>

                        {/* Active Markets */}
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

                    {/* Right Sidebar - Market News & Token Profiles */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-lg shadow-md sticky top-24">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold">Market News</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Latest updates and announcements
                                </p>
                            </div>
                            <div className="p-4">
                                <div className="flex space-x-4 mb-4">
                                    <button
                                        onClick={() => handleTabChange('twitter')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeTab === 'twitter'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        Twitter
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('news')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeTab === 'news'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        News
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('profiles')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeTab === 'profiles'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        Profiles
                                    </button>
                                </div>
                                <div className="h-[600px] overflow-y-auto">
                                    {activeTab === 'twitter' && (
                                        <NewsComponent key={`twitter-${key}`} type="twitter" title="Twitter Updates"/>
                                    )}
                                    {activeTab === 'news' && (
                                        <NewsComponent key={`news-${key}`} type="block" title="Block News"/>
                                    )}
                                    {activeTab === 'profiles' && (
                                        <TokenProfileList
                                            key={`profiles-${key}`}
                                            profiles={tokenProfiles || []}
                                            isLoading={isLoadingProfiles}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function Page() {
    return (
        <Providers>
            <App/>
        </Providers>
    );
}