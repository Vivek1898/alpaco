import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, DollarSign, BarChart2, Activity, Bitcoin, Feather as Ethereum } from "lucide-react";

interface MarketStatsProps {
  data: any;
  isLoading: boolean;
}

export function MarketStats({ data, isLoading }: MarketStatsProps) {
  if (isLoading) {
    return <MarketStatsSkeleton />;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const stats = [
    {
      title: "Total Market Cap",
      value: `$${formatNumber(data.quote?.USD?.total_market_cap || 0)}`,
      change: data.quote?.USD?.total_market_cap_yesterday_percentage_change || 0,
      icon: DollarSign,
    },
    {
      title: "24h Volume",
      value: `$${formatNumber(data.quote?.USD?.total_volume_24h || 0)}`,
      change: data.quote?.USD?.total_volume_24h_yesterday_percentage_change || 0,
      icon: BarChart2,
    },
    {
      title: "BTC Dominance",
      value: `${data.btc_dominance?.toFixed(2) || "0.00"}%`,
      change: data.btc_dominance_24h_percentage_change || 0,
      icon: Bitcoin,
    },
    {
      title: "ETH Dominance",
      value: `${data.eth_dominance?.toFixed(2) || "0.00"}%`,
      change: data.eth_dominance_24h_percentage_change || 0,
      icon: Ethereum,
    },
    {
      title: "Active Cryptocurrencies",
      value: formatNumber(data.active_cryptocurrencies || 0),
      icon: Activity,
    },
    {
      title: "Active Exchanges",
      value: formatNumber(data.active_exchanges || 0),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change !== undefined && (
              <p className={`text-xs ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}%
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MarketStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[80px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}