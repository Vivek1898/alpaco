import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ExternalLink, 
  Calendar, 
  Users, 
  Gift, 
  Link as LinkIcon,
  Info
} from 'lucide-react';
import { formatDistanceToNow, format, isValid } from 'date-fns';
import { formatNumber } from '@/lib/utils';

interface AirdropDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  airdropId: string | null;
}

export function AirdropDetailsModal({ isOpen, onClose, airdropId }: AirdropDetailsModalProps) {
  const [airdropDetails, setAirdropDetails] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchAirdropDetails() {
      if (!airdropId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/cryptocurrency/airdrop?id=${airdropId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch airdrop details');
        }
        const data = await response.json();
        setAirdropDetails(data.data);
      } catch (error) {
        console.error('Error fetching airdrop details:', error);
        setError('Failed to load airdrop details');
      } finally {
        setLoading(false);
      }
    }

    if (isOpen && airdropId) {
      fetchAirdropDetails();
    } else {
      setAirdropDetails(null);
      setError(null);
    }
  }, [isOpen, airdropId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-48" />
            ) : error ? (
              'Error Loading Airdrop'
            ) : airdropDetails ? (
              <div className="flex items-center gap-3">
                <Gift className="h-6 w-6" />
                {airdropDetails.project_name}
                <Badge variant={
                  airdropDetails.status === 'ONGOING' ? 'default' :
                  airdropDetails.status === 'UPCOMING' ? 'secondary' :
                  'outline'
                }>
                  {airdropDetails.status}
                </Badge>
              </div>
            ) : null}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : airdropDetails ? (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{airdropDetails.description}</p>
            </div>

            {/* Coin Information */}
            {airdropDetails.coin && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Token Information</h3>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{airdropDetails.coin.name}</span>
                  <Badge variant="secondary">{airdropDetails.coin.symbol}</Badge>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Start Date</h3>
                {airdropDetails.start_date && isValid(new Date(airdropDetails.start_date)) ? (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">
                      {format(new Date(airdropDetails.start_date), 'PPP')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(airdropDetails.start_date), { addSuffix: true })}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">End Date</h3>
                {airdropDetails.end_date && isValid(new Date(airdropDetails.end_date)) ? (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">
                      {format(new Date(airdropDetails.end_date), 'PPP')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(airdropDetails.end_date), { addSuffix: true })}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
            </div>

            {/* Prize Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Total Prize</h3>
                <span className="text-muted-foreground">
                  {formatNumber(airdropDetails.total_prize || 0)} tokens
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Winner Count</h3>
                <span className="text-muted-foreground">
                  {formatNumber(airdropDetails.winner_count || 0)} winners
                </span>
              </div>
            </div>

            {/* Links */}
            {airdropDetails.link && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Links</h3>
                <a
                  href={airdropDetails.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Airdrop Page</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}