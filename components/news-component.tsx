"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Newspaper, Search } from "lucide-react";

interface NewsItem {
    _id: string;
    title: string;
    source: string;
    url: string;
    icon?: string;
    image?: string;
    time: number;
}

interface NewsComponentProps {
    type: 'twitter' | 'block';
    title: string;
}

const TextWithReadMore = ({ text, maxLength = 280 }: { text: string; maxLength?: number }) => {
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

export default function NewsComponent({ type, title }: NewsComponentProps) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const lastId = useRef<string | null>(null);
    const currentLimit = useRef(50);
    const previousLimit = useRef(50);
    const LIMIT_INCREMENT = 50;

    const filterNews = (data: NewsItem[]) => {
        if (type === 'twitter') {
            return data.filter(item => item.source === 'Twitter');
        } else {
            return data.filter(item => item.source !== 'Twitter');
        }
    };

    // Filter news based on search term
    const getFilteredNews = useCallback(() => {
        if (!searchTerm) return news;

        const lowerSearchTerm = searchTerm.toLowerCase();
        return news.filter(item =>
            item.title.toLowerCase().includes(lowerSearchTerm) ||
            item.source.toLowerCase().includes(lowerSearchTerm)
        );
    }, [news, searchTerm]);

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

            const filteredData = filterNews(data);

            if (filteredData.length === 0) {
                currentLimit.current += LIMIT_INCREMENT;
                setLoading(false);
                fetchNews();
                return;
            }

            const currentLastId = data[data.length - 1]._id;

            if (currentLastId === lastId.current && currentLimit.current === previousLimit.current) {
                console.log('No new data: Same last ID and limit');
                setHasMore(false);
                return;
            }

            lastId.current = currentLastId;
            previousLimit.current = currentLimit.current;
            currentLimit.current += LIMIT_INCREMENT;

            setNews(prevNews => {
                const newUniqueItems = filteredData.filter(newItem =>
                    !prevNews.some(existingItem => existingItem._id === newItem._id)
                );
                return [...prevNews, ...newUniqueItems];
            });

        } catch (error) {
            console.error('Error fetching news:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, type]);

    const observer = useRef<IntersectionObserver>();
    const lastNewsElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchNews();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore, fetchNews]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const renderNewsItem = (item: NewsItem, isLastElement: boolean) => (
        <div
            key={item._id}
            ref={isLastElement ? lastNewsElementRef : null}
            className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
            {(item.icon || item.image) ? (
                <img
                    src={item.icon || item.image}
                    alt={item.source}
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover bg-gray-100"
                />
            ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full flex-shrink-0">
                    <Newspaper className="w-6 h-6 text-gray-500" />
                </div>
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
                        <span className="text-sm text-gray-500 flex items-center gap-2">
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

    const filteredNews = getFilteredNews();

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle>{title}</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                            placeholder="Search news..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-9"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredNews.map((item, index) =>
                            renderNewsItem(item, !searchTerm && index === news.length - 1)
                        )}

                        {filteredNews.length === 0 && !loading && (
                            <div className="text-center text-gray-500 py-4">
                                No results found
                            </div>
                        )}

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

                        {!hasMore && filteredNews.length > 0 && !searchTerm && (
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