import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GainersLosersViewProps {
  data: any[];
  isLoading: boolean;
  timeWindow?: string;
}

export function GainersLosersView({ data, isLoading, timeWindow = "24h" }: GainersLosersViewProps) {
  if (isLoading) {
    return <GainersLosersSkeleton />;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Sort data by percent change
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    const aChange = a.quote.USD[`percent_change_${timeWindow}`];
    const bChange = b.quote.USD[`percent_change_${timeWindow}`];
    return bChange - aChange;
  });

  const gainers = sortedData.filter(coin => 
    coin.quote.USD[`percent_change_${timeWindow}`] > 0
  );
  const losers = sortedData.filter(coin => 
    coin.quote.USD[`percent_change_${timeWindow}`] < 0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-500">
            <TrendingUp className="h-5 w-5" />
            Top Gainers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gainers.slice(0, 5).map((coin) => (
              <div
                key={coin.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{coin.name}</span>
                    <Badge variant="secondary" className="w-fit">
                      {coin.symbol}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-500 font-medium">
                    +{coin.quote.USD[`percent_change_${timeWindow}`].toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${formatNumber(coin.quote.USD.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <TrendingDown className="h-5 w-5" />
            Top Losers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {losers.slice(-5).reverse().map((coin) => (
              <div
                key={coin.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{coin.name}</span>
                    <Badge variant="secondary" className="w-fit">
                      {coin.symbol}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-red-500 font-medium">
                    {coin.quote.USD[`percent_change_${timeWindow}`].toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${formatNumber(coin.quote.USD.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GainersLosersSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}