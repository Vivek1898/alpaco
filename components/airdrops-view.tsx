import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Gift, ExternalLink, Calendar, Link as LinkIcon } from "lucide-react";
import { formatDistanceToNow, isValid } from "date-fns";

interface AirdropData {
  id: string;
  project_name: string;
  description: string;
  status: string;
  coin: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
  };
  start_date: string;
  end_date: string;
  total_prize: number;
  winner_count: number;
  link: string;
}

interface AirdropsViewProps {
  data: AirdropData[];
  isLoading: boolean;
}

export function AirdropsView({ data, isLoading }: AirdropsViewProps) {
  if (isLoading) {
    return <AirdropsSkeleton />;
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Active Airdrops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No active airdrops available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Active Airdrops
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((airdrop: AirdropData) => (
            <div
              key={airdrop.id}
              className="flex flex-col space-y-2 p-4 bg-muted rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{airdrop.project_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{airdrop.coin.symbol}</Badge>
                    <Badge 
                      variant={airdrop.status === 'ONGOING' ? 'default' : 'secondary'}
                    >
                      {airdrop.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {airdrop.link && (
                    <a
                      href={airdrop.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                      title="Airdrop Link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {airdrop.description}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {airdrop.end_date && isValid(new Date(airdrop.end_date)) ? (
                    <span>
                      Ends {formatDistanceToNow(new Date(airdrop.end_date), { addSuffix: true })}
                    </span>
                  ) : (
                    <span>No end date specified</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  <span>{airdrop.total_prize.toLocaleString()} tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>{airdrop.winner_count.toLocaleString()} winners</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AirdropsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}