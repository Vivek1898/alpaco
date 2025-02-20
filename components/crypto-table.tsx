import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface CryptoTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function CryptoTable<TData, TValue>({
  columns,
  data,
}: CryptoTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function SentimentIndicator({ value }: { value: number }) {
  let color = "bg-gray-200";
  let icon = <Minus className="h-4 w-4" />;
  let text = "Neutral";

  if (value > 0.6) {
    color = "bg-green-500";
    icon = <ArrowUpRight className="h-4 w-4 text-white" />;
    text = "Strong Buy";
  } else if (value > 0.3) {
    color = "bg-green-300";
    icon = <ArrowUpRight className="h-4 w-4 text-white" />;
    text = "Buy";
  } else if (value < -0.6) {
    color = "bg-red-500";
    icon = <ArrowDownRight className="h-4 w-4 text-white" />;
    text = "Strong Sell";
  } else if (value < -0.3) {
    color = "bg-red-300";
    icon = <ArrowDownRight className="h-4 w-4 text-white" />;
    text = "Sell";
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cn("p-1 rounded-full", color)}>
        {icon}
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function AlpacaScore({ value }: { value: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-green-400";
    if (score >= 40) return "text-yellow-500";
    if (score >= 20) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-green-400";
    if (score >= 40) return "bg-yellow-500";
    if (score >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={cn("text-sm font-medium", getScoreColor(value))}>
          {value.toFixed(0)}
        </span>
        <span className="text-xs text-muted-foreground">
          {value >= 70 ? "Strong Buy" :
           value >= 60 ? "Buy" :
           value >= 40 ? "Hold" :
           value >= 30 ? "Sell" : "Strong Sell"}
        </span>
      </div>
      <Progress 
        value={value} 
        className="h-2" 
        indicatorClassName={cn(getProgressColor(value))}
      />
    </div>
  );
}

export const cryptoColumns = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => (
      <div 
        className="flex items-center gap-2 cursor-pointer hover:text-primary"
        onClick={() => window.location.href = `/dashboard/coin/${row.original.symbol}`}
      >
        <span className="font-medium">{row.original.name}</span>
        <Badge variant="secondary">{row.original.symbol}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "quote.USD.price",
    header: "Price",
    cell: ({ row }: any) => (
      <span>${formatNumber(row.original.quote.USD.price)}</span>
    ),
  },
  {
    accessorKey: "quote.USD.percent_change_24h",
    header: "24h %",
    cell: ({ row }: any) => {
      const change = row.original.quote.USD.percent_change_24h;
      return (
        <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
          {change.toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: "quote.USD.market_cap",
    header: "Market Cap",
    cell: ({ row }: any) => (
      <span>${formatNumber(row.original.quote.USD.market_cap)}</span>
    ),
  },
  {
    accessorKey: "quote.USD.volume_24h",
    header: "Volume (24h)",
    cell: ({ row }: any) => (
      <span>${formatNumber(row.original.quote.USD.volume_24h)}</span>
    ),
  },
  {
    accessorKey: "sentiment",
    header: "Market Sentiment",
    cell: ({ row }: any) => {
      // Calculate sentiment based on technical indicators
      const price = row.original.quote.USD.price;
      const change24h = row.original.quote.USD.percent_change_24h;
      const change7d = row.original.quote.USD.percent_change_7d;
      const volume = row.original.quote.USD.volume_24h;
      const prevVolume = volume / (1 + row.original.quote.USD.volume_change_24h / 100);
      
      // Simple sentiment calculation based on price action and volume
      let sentiment = 0;
      
      // Price trend contribution
      sentiment += change24h > 0 ? 0.3 : -0.3;
      sentiment += change7d > 0 ? 0.2 : -0.2;
      
      // Volume analysis
      if (volume > prevVolume) {
        sentiment += change24h > 0 ? 0.2 : -0.2;
      }
      
      // Clamp sentiment between -1 and 1
      sentiment = Math.max(-1, Math.min(1, sentiment));
      
      return <SentimentIndicator value={sentiment} />;
    },
  },
  {
    accessorKey: "alpaca_score",
    header: "Alpaca Score",
    cell: ({ row }: any) => {
      const data = row.original;
      const quote = data.quote.USD;

      // Calculate Alpaca Score (0-100) based on multiple factors
      let score = 50; // Start at neutral

      // 1. Price Momentum (0-25 points)
      const momentum = (
        (quote.percent_change_24h > 0 ? 5 : -5) +
        (quote.percent_change_7d > 0 ? 10 : -10) +
        (quote.percent_change_30d > 0 ? 10 : -10)
      );
      score += momentum;

      // 2. Volume Analysis (0-20 points)
      const volumeChange = quote.volume_change_24h;
      if (volumeChange > 50) score += 20;
      else if (volumeChange > 25) score += 15;
      else if (volumeChange > 0) score += 10;
      else if (volumeChange > -25) score += 5;

      // 3. Market Cap Stability (0-15 points)
      const marketCapRank = data.rank;
      if (marketCapRank <= 10) score += 15;
      else if (marketCapRank <= 50) score += 10;
      else if (marketCapRank <= 100) score += 5;

      // 4. Price Volatility (0-15 points)
      const volatility = Math.abs(quote.percent_change_24h);
      if (volatility < 5) score += 15;
      else if (volatility < 10) score += 10;
      else if (volatility < 20) score += 5;

      // 5. Market Dominance (0-15 points)
      const marketDominance = (quote.market_cap / quote.total_market_cap) * 100;
      if (marketDominance > 10) score += 15;
      else if (marketDominance > 5) score += 10;
      else if (marketDominance > 1) score += 5;

      // 6. Volume/Market Cap Ratio (0-10 points)
      const volumeMarketCapRatio = (quote.volume_24h / quote.market_cap) * 100;
      if (volumeMarketCapRatio > 20) score += 10;
      else if (volumeMarketCapRatio > 10) score += 7;
      else if (volumeMarketCapRatio > 5) score += 5;

      // Ensure score stays within 0-100 range
      score = Math.max(0, Math.min(100, score));

      return <AlpacaScore value={score} />;
    },
  },
];