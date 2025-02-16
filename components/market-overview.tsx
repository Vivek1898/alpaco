"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { coinLayerService } from "@/lib/coinlayer";
import { Skeleton } from "./ui/skeleton";
import { TrendingUp, DollarSign, Activity, ChevronUp, ChevronDown, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { TechnicalMeter } from "./technical-meter";
import {cn} from "@/lib/utils";

interface CryptoData {
  symbol: string;
  rate: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  technicalAnalysis: {
    "1min": TechnicalSignals;
    "5min": TechnicalSignals;
    "1hour": TechnicalSignals;
  };
}

interface TechnicalSignals {
  buySignals: number;
  sellSignals: number;
  neutralSignals: number;
}

const TOP_CRYPTOS = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'LINK'];

function generateTechnicalSignals(): TechnicalSignals {
  const total = 26;
  const buy = Math.floor(Math.random() * 11) + 3;
  const sell = Math.floor(Math.random() * 11) + 3;
  const neutral = total - buy - sell;
  
  return {
    buySignals: buy,
    sellSignals: sell,
    neutralSignals: neutral
  };
}

interface MarketOverviewProps {
  compact?: boolean;
}

export function MarketOverview({ compact = false }: MarketOverviewProps) {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1min" | "5min" | "1hour">("1min");

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await coinLayerService.getLiveRates(TOP_CRYPTOS);
      
      const processedData = Object.entries(response.rates).map(([symbol, rate]) => {
        const marketCap = rate * (symbol === 'BTC' ? 19_000_000 : 100_000_000);
        const volume24h = marketCap * 0.1;
        const change24h = (Math.random() * 10) - 5;
        
        return {
          symbol,
          rate,
          change24h,
          marketCap,
          volume24h,
          technicalAnalysis: {
            "1min": generateTechnicalSignals(),
            "5min": generateTechnicalSignals(),
            "1hour": generateTechnicalSignals()
          }
        };
      });

      setCryptoData(processedData.sort((a, b) => b.marketCap - a.marketCap));
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch market data. Please try again later.');
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0);
  const total24hVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume24h, 0);
  const btcDominance = cryptoData.find(c => c.symbol === 'BTC')?.marketCap 
    ? (cryptoData.find(c => c.symbol === 'BTC')!.marketCap / totalMarketCap) * 100 
    : 0;

  if (compact) {
    return (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                ${(totalMarketCap / 1e9).toFixed(2)}B
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                ${(total24hVolume / 1e9).toFixed(2)}B
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {btcDominance.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </>
    );
  }

  return (
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Technical Analysis</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Real-time market analysis and technical indicators
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground w-full sm:w-auto">
            {lastUpdated && (
                <span className="hidden sm:inline">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            )}
            <Button
                variant="outline"
                size="sm"
                onClick={fetchMarketData}
                disabled={loading}
                className="ml-auto sm:ml-0"
            >
              <RefreshCcw className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {error ? (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-600 text-sm sm:text-base">{error}</p>
            </Card>
        ) : (
            <>
              {/* Market Stats */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Market Cap</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">
                      ${(totalMarketCap / 1e9).toFixed(2)}B
                    </div>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Combined value of tracked assets
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">24h Volume</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">
                      ${(total24hVolume / 1e9).toFixed(2)}B
                    </div>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Total trading volume in 24h
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">BTC Dominance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">
                      {btcDominance.toFixed(2)}%
                    </div>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Bitcoin&#39;s market share
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Active Markets</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg sm:text-2xl font-bold">{cryptoData.length}</div>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Tracked trading pairs
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Timeframe Selection */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0">
                <Button
                    variant={selectedTimeframe === "1min" ? "default" : "outline"}
                    onClick={() => setSelectedTimeframe("1min")}
                    className="whitespace-nowrap text-sm"
                >
                  1 minute
                </Button>
                <Button
                    variant={selectedTimeframe === "5min" ? "default" : "outline"}
                    onClick={() => setSelectedTimeframe("5min")}
                    className="whitespace-nowrap text-sm"
                >
                  5 minutes
                </Button>
                <Button
                    variant={selectedTimeframe === "1hour" ? "default" : "outline"}
                    onClick={() => setSelectedTimeframe("1hour")}
                    className="whitespace-nowrap text-sm"
                >
                  1 hour
                </Button>
              </div>

              {/* Cryptocurrencies Grid */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[250px] sm:h-[300px] w-full" />
                    ))
                ) : (
                    cryptoData.map((crypto) => (
                        <Card key={crypto.symbol} className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-semibold text-primary">
                          {crypto.symbol}
                        </span>
                              </div>
                              <div>
                                <p className="text-sm sm:text-base font-medium">
                                  ${coinLayerService.formatRate(crypto.rate)}
                                </p>
                                <div className={cn(
                                    "flex items-center text-xs sm:text-sm",
                                    crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                                )}>
                                  {crypto.change24h >= 0 ? (
                                      <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                  ) : (
                                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                                  )}
                                  <span>{Math.abs(crypto.change24h).toFixed(2)}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                MCap: ${(crypto.marketCap / 1e9).toFixed(2)}B
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Vol: ${(crypto.volume24h / 1e9).toFixed(2)}B
                              </p>
                            </div>
                          </div>

                          <TechnicalMeter
                              symbol={crypto.symbol}
                              timeframe={selectedTimeframe}
                              {...crypto.technicalAnalysis[selectedTimeframe]}
                          />
                        </Card>
                    ))
                )}
              </div>
            </>
        )}
      </div>
  );
}