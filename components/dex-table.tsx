"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { dexApi } from "@/lib/dex-api";
import type { DexListing } from "@/lib/dex-api";
import { formatNumber } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { DexInfoModal } from "./dex-info-modal";

interface DexTableProps {
  networkId: number;
}

export function DexTable({ networkId }: DexTableProps) {
  const [listings, setListings] = useState<DexListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedDexId, setSelectedDexId] = useState<number | null>(null);
  const { ref, inView } = useInView();

  const ITEMS_PER_PAGE = 20;

  const resetTable = useCallback(() => {
    setListings([]);
    setHasMore(true);
    setPage(1);
    setError(null);
    setLoading(true);
  }, []);

  const fetchListings = useCallback(async (start: number = 1) => {
    try {
      setError(null);
      const data = await dexApi.getListings({
        network_id: networkId,
        start,
        limit: ITEMS_PER_PAGE,
        sort: 'volume_24h',
        sort_dir: 'desc',
      });
      
      if (start === 1) {
        setListings(data);
      } else {
        setListings(prev => [...prev, ...data]);
      }
      
      // setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      setError("Failed to load DEX data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [networkId]);

  useEffect(() => {
    resetTable();
    fetchListings(1);
  }, [networkId, resetTable, fetchListings]);

  // useEffect(() => {
  //   if (inView && hasMore && !loading) {
  //     const nextPage = page + 1;
  //     setPage(nextPage);
  //     fetchListings(nextPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1);
  //   }
  // }, [inView, hasMore, loading, page, fetchListings]);

  if (error) {
    return (
      <div className="rounded-md border p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => {
          resetTable();
          fetchListings(1);
        }}>Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Market Share</TableHead>
              <TableHead className="text-right">Pairs</TableHead>
              <TableHead className="text-right">Volume Change (24h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && listings.length === 0 ? (
              <TableLoadingSkeleton />
            ) : (
              <>
                {listings.map((dex, index) => (
                  <TableRow 
                    key={dex.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedDexId(dex.id)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {dex.logo && (
                          <img
                            src={dex.logo}
                            alt={`${dex.name} logo`}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        {dex.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatNumber(dex.quote[0]?.volume_24h || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {dex.market_share.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">{dex.num_market_pairs}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          (dex.quote[0]?.percent_change_volume_24h || 0) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {(dex.quote[0]?.percent_change_volume_24h || 0).toFixed(2)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {hasMore && (
                  <TableRow ref={ref}>
                    <TableCell colSpan={6}>
                      <LoadingShimmer />
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <DexInfoModal 
        isOpen={selectedDexId !== null}
        onClose={() => setSelectedDexId(null)}
        dexId={selectedDexId}
      />
    </>
  );
}

function TableLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-6" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px] ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[60px] ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[40px] ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[80px] ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function LoadingShimmer() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-[150px] bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-[100px] bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
          <div className="h-4 w-[60px] bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-[40px] bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-[80px] bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}