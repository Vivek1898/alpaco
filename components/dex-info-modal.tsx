import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, MessageCircle, Twitter, Globe, FileText } from 'lucide-react';

interface DexInfo {
  id: number;
  name: string;
  description: string | null;
  logo: string;
  urls: {
    website?: string[];
    blog?: string[];
    chat?: string[];
    fee?: string[];
    twitter?: string[];
  };
  date_launched: string;
  notice: string;
  status: string;
}

interface DexInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  dexId: number | null;
}

export function DexInfoModal({ isOpen, onClose, dexId }: DexInfoModalProps) {
  const [dexInfo, setDexInfo] = React.useState<DexInfo | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchDexInfo() {
      if (!dexId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/dex/info?id=${dexId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch DEX information');
        }
        const data = await response.json();
        setDexInfo(data.data[0]);
      } catch (error) {
        console.error('Error fetching DEX info:', error);
        setError('Failed to load DEX information');
      } finally {
        setLoading(false);
      }
    }

    if (isOpen && dexId) {
      fetchDexInfo();
    } else {
      setDexInfo(null);
      setError(null);
    }
  }, [isOpen, dexId]);

  const renderLink = (url: string, icon: React.ReactNode, label: string) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-primary hover:underline"
    >
      {icon}
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-48" />
            ) : error ? (
              'Error Loading DEX'
            ) : dexInfo ? (
              <div className="flex items-center gap-3">
                {dexInfo.logo && (
                  <img
                    src={dexInfo.logo}
                    alt={`${dexInfo.name} logo`}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                {dexInfo.name}
                {dexInfo.status === 'active' && (
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                )}
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
        ) : dexInfo ? (
          <div className="space-y-6">
            {dexInfo.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{dexInfo.description}</p>
              </div>
            )}

            {dexInfo.date_launched && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Launch Date</h3>
                <p className="text-muted-foreground">
                  {new Date(dexInfo.date_launched).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {dexInfo.urls && Object.keys(dexInfo.urls).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  {dexInfo.urls.website?.[0] && (
                    renderLink(dexInfo.urls.website[0], <Globe className="h-4 w-4" />, "Website")
                  )}
                  {dexInfo.urls.blog?.[0] && (
                    renderLink(dexInfo.urls.blog[0], <FileText className="h-4 w-4" />, "Blog")
                  )}
                  {dexInfo.urls.chat?.[0] && (
                    renderLink(dexInfo.urls.chat[0], <MessageCircle className="h-4 w-4" />, "Chat")
                  )}
                  {dexInfo.urls.twitter?.[0] && (
                    renderLink(dexInfo.urls.twitter[0], <Twitter className="h-4 w-4" />, "Twitter")
                  )}
                </div>
              </div>
            )}

            {dexInfo.notice && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">{dexInfo.notice}</p>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}