"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface NewsItem {
    _id: string;
    title: string;
    source: string;
    url: string;
    icon: string;
    time: number;
}

const TextWithReadMore = ({ text, maxLength = 280 }:any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > maxLength;

    const displayText = isExpanded ? text : (
        shouldTruncate ? `${text.slice(0, maxLength)}...` : text
    );

    return (
        <div>
            <p className="text-sm text-gray-800">{displayText}</p>
            {shouldTruncate && (
                <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Show Less' : 'Read More'}
                </Button>
            )}
        </div>
    );
};

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const lastId = useRef<string | null>(null);
    const currentLimit = useRef(50);
    const previousLimit = useRef(50);
    const LIMIT_INCREMENT = 50;

    const fetchNews = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);

            let url = `https://news.treeofalpha.com/api/news?limit=${currentLimit.current}`;
            if (lastId.current) {
                url += `&last_id=${lastId.current}`;
            }

            console.log('Fetching:', url);
            const response = await fetch(url);
            const data = await response.json();

            if (data.length === 0) {
                setHasMore(false);
                return;
            }

            const currentLastId = data[data.length - 1]._id;
            console.log('Previous last ID:', lastId.current);
            console.log('Current last ID:', currentLastId);
            console.log('Previous limit:', previousLimit.current);
            console.log('Current limit:', currentLimit.current);

            // Check if both last ID and limit are the same
            if (currentLastId === lastId.current && currentLimit.current === previousLimit.current) {
                console.log('No new data: Same last ID and limit');
                setHasMore(false);
                return;
            }

            // Update tracking refs
            lastId.current = currentLastId;
            previousLimit.current = currentLimit.current;
            currentLimit.current += LIMIT_INCREMENT;

            setNews(prevNews => [...prevNews, ...data]);

        } catch (error) {
            console.error('Error fetching news:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore]);

    const observer = useRef<IntersectionObserver>();
    const lastNewsElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log('Last element intersecting, fetching more news...');
                console.log('Current limit before fetch:', currentLimit.current);
                fetchNews();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchNews]);

    // Initial fetch
    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Latest Crypto News</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {news.map((item, index) => {
                            const isLastElement = index === news.length - 1;

                            return (
                                <div
                                    key={item._id}
                                    ref={isLastElement ? lastNewsElementRef : null}
                                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    {item.icon && (
                                        <img
                                            src={item.icon}
                                            alt={item.source}
                                            className="w-12 h-12 rounded-full flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block hover:text-blue-600"
                                        >
                                            <TextWithReadMore text={item.title} />
                                            <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          {item.source}
                        </span>
                                                <span className="text-sm text-gray-500">
                          {new Date(item.time).toLocaleString()}
                        </span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}

                        {loading && (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg">
                                        <Skeleton className="w-12 h-12 rounded-full" />
                                        <div className="flex-1">
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!hasMore && news.length > 0 && (
                            <div className="text-center text-gray-500 py-4">
                                You've reached the end of the news feed
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}