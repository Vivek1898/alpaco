'use client';

/* eslint-disable */
// @ts-nocheck

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHistoricalData, useCryptoAnalysis } from '@/lib/api';
import { CryptoChart } from '@/components/crypto-chart';
import { TechnicalMeter } from '@/components/technical-meter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import { formatNumber, cn } from '@/lib/utils';
import {
    TrendingUp,
    TrendingDown,
    BarChart2,
    Activity,
    Brain,
    Gauge,
    MessageSquare
} from 'lucide-react';

const timeframes = [
    { value: "1min", label: "1 Minute" },
    { value: "5min", label: "5 Minutes" },
    { value: "1hour", label: "1 Hour"  }
] as const;

export default function CoinPageClient() {
    const { symbol } = useParams();
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const { data: historicalData, isLoading: isHistoricalLoading } = useHistoricalData(symbol as string);
    const { technical, social, fearAndGreed, score, isLoading: isAnalysisLoading } = useCryptoAnalysis(symbol as string);

    const getTechnicalSignals = (timeframe: string) => {
        const random = () => Math.floor(Math.random() * 10) + 1;
        switch (timeframe) {
            case "1min":
                return {
                    buySignals: random(),
                    sellSignals: random(),
                    neutralSignals: random()
                };
            case "5min":
                return {
                    buySignals: random(),
                    sellSignals: random(),
                    neutralSignals: random()
                };
            case "1hour":
                return {
                    buySignals: random(),
                    sellSignals: random(),
                    neutralSignals: random()
                };
            default:
                return {
                    buySignals: 0,
                    sellSignals: 0,
                    neutralSignals: 0
                };
        }
    };

    useEffect(() => {
        async function fetchAnalysis() {
            if (!technical || !social || !fearAndGreed || !historicalData) return;

            try {
                const quotes = historicalData[symbol as string][0].quotes;
                const latestQuote = quotes[quotes.length - 1].quote.USD;

                const response = await fetch('/api/analysis', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        symbol,
                        data: {
                            technical,
                            social,
                            fearAndGreed,
                            price: latestQuote.price,
                            priceChange: latestQuote.percent_change_24h,
                            marketCap: latestQuote.market_cap,
                            volume: latestQuote.volume_24h,
                        },
                    }),
                });

                if (!response.ok) throw new Error('Failed to generate analysis');

                const data = await response.json();
                setAnalysis(data.analysis);
            } catch (error) {
                console.error('Error generating analysis:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalysis();
    }, [symbol, technical, social, fearAndGreed, historicalData]);

    const getChartData = () => {
        if (!historicalData?.[symbol as string]?.[0]?.quotes) return [];

        return historicalData[symbol as string][0].quotes.map((quote: any) => ({
            time: new Date(quote.timestamp).getTime() / 1000,
            value: quote.quote.USD.price
        }));
    };

    if (isHistoricalLoading || isAnalysisLoading) {
        return (
            <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{symbol || ""}</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">Rank #{historicalData?.[symbol as string]?.[0]?.cmc_rank || "---"}</Badge>
                            {score !== null && (
                                <Badge variant={score >= 70 ? "default" : score >= 50 ? "secondary" : "destructive"}>
                                    Score: {score.toFixed(0)}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Technical Meters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {timeframes.map((timeframe) => {
                        const signals = getTechnicalSignals(timeframe.value);
                        return (
                            <TechnicalMeter
                                key={timeframe.value}
                                symbol={symbol as string}
                                timeframe={timeframe.value as any}
                                {...signals}
                            />
                        );
                    })}
                </div>

                {/* Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Price Chart
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CryptoChart
                            data={getChartData() || []}
                            colors={{
                                backgroundColor: 'white',
                                lineColor: '#22c55e',
                                textColor: '#1f2937',
                                areaTopColor: '#22c55e',
                                areaBottomColor: 'rgba(34, 197, 94, 0.2)',
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Technical Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gauge className="h-5 w-5" />
                                RSI
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-2xl font-bold">{technical?.rsi?.toFixed(2) || 'N/A'}</div>
                                <Progress
                                    value={Math.max(technical?.rsi || 0,0)}
                                    className="h-2"
                                    indicatorClassName={
                                        technical?.rsi >= 70 ? "bg-red-500" :
                                            technical?.rsi >= 50 ? "bg-yellow-500" :
                                                technical?.rsi >= 30 ? "bg-green-500" :
                                                    "bg-red-500"
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                MACD
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-2xl font-bold">{technical?.macd?.toFixed(2) || 'N/A'}</div>
                                <Progress
                                    value={50 + (technical?.macd || 0)}
                                    className="h-2"
                                    indicatorClassName={technical?.macd > 0 ? "bg-green-500" : "bg-red-500"}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Social Sentiment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-2xl font-bold">
                                    {((social?.positive || 0) * 100).toFixed(0) || "0"}%
                                </div>
                                <Progress
                                    value={(social?.positive || 0) * 100}
                                    className="h-2"
                                    indicatorClassName={
                                        (social?.positive || 0) >= 0.7 ? "bg-green-500" :
                                            (social?.positive || 0) >= 0.5 ? "bg-yellow-500" :
                                                "bg-red-500"
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                Alpaca Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-2xl font-bold">{score?.toFixed(0) || 'N/A'}</div>
                                <Progress
                                    value={score || 0}
                                    className="h-2"
                                    indicatorClassName={
                                        score as any >= 70 ? "bg-green-500" :
                                            score as any >= 50 ? "bg-yellow-500" :
                                                "bg-red-500"
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            ALPACO MARKET INTELLIGENCE
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-40 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : analysis ? (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-2 text-muted-foreground" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-4" {...props} />,
                                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-semibold text-primary" {...props} />,
                                    }}
                                >
                                    {analysis || ""}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="text-muted-foreground">
                                Analysis not available at this time.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}