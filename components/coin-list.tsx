"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { coinLayerService } from "@/lib/coinlayer";
import { Skeleton } from "./ui/skeleton";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CoinData {
  symbol: string;
  rate: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export function CoinList() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const response = await coinLayerService.getLiveRates();
        const processedData = Object.entries(response.rates).map(([symbol, rate]) => {
          const marketCap = rate * (symbol === 'BTC' ? 19_000_000 : 100_000_000);
          const volume24h = marketCap * 0.1;
          const change24h = (Math.random() * 10) - 5; // Simulated change
          
          return {
            symbol,
            rate,
            change24h,
            marketCap,
            volume24h,
          };
        });

        setCoins(processedData.sort((a, b) => b.marketCap - a.marketCap));
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoins();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">24h Volume</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin) => (
            <TableRow key={coin.symbol}>
              <TableCell className="font-medium">{coin.symbol}</TableCell>
              <TableCell className="text-right">
                ${coinLayerService.formatRate(coin.rate)}
              </TableCell>
              <TableCell className="text-right">
                <div className={`flex items-center justify-end ${
                  coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {coin.change24h >= 0 ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(coin.change24h).toFixed(2)}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                ${(coin.marketCap / 1e9).toFixed(2)}B
              </TableCell>
              <TableCell className="text-right">
                ${(coin.volume24h / 1e9).toFixed(2)}B
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}