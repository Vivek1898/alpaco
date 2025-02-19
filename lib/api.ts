import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export function useMarketData() {
  // Fear & Greed Index
  const { data: fearAndGreed, error: fearAndGreedError } = useSWR('/api/fear-and-greed/latest', fetcher);
  
  // Latest Listings
  const { data: latestListings, error: latestListingsError } = useSWR('/api/cryptocurrency/listings/latest', fetcher);
  
  // New Listings
  const { data: newListings, error: newListingsError } = useSWR('/api/cryptocurrency/listings/new', fetcher);
  
  // Trending Latest
  const { data: trendingLatest, error: trendingLatestError } = useSWR('/api/cryptocurrency/trending/latest', fetcher);
  
  // Gainers & Losers
  const { data: trendingGainersLosers, error: trendingGainersLosersError } = useSWR('/api/cryptocurrency/trending/gainers-losers', fetcher);
  
  // Historical Price Data
  const { data: historicalData, error: historicalDataError } = useSWR('/api/cryptocurrency/quotes/historical?symbol=BTC&interval=1d&count=30', fetcher);

  // Global Market Metrics
  const { data: globalMetrics, error: globalMetricsError } = useSWR('/api/global-metrics/latest', fetcher);

  const isLoading = !fearAndGreed && !fearAndGreedError ||
                   !latestListings && !latestListingsError ||
                   !newListings && !newListingsError ||
                   !trendingLatest && !trendingLatestError ||
                   !trendingGainersLosers && !trendingGainersLosersError ||
                   !historicalData && !historicalDataError ||
                   !globalMetrics && !globalMetricsError;

  const error = fearAndGreedError || latestListingsError || newListingsError || 
                trendingLatestError || trendingGainersLosersError || historicalDataError ||
                globalMetricsError;

  return {
    data: {
      fearAndGreed: fearAndGreed?.data,
      latestListings: latestListings?.data,
      newListings: newListings?.data,
      trendingLatest: trendingLatest?.data,
      trendingGainersLosers: trendingGainersLosers?.data,
      historicalData: historicalData?.data,
      globalMetrics: globalMetrics?.data,
    },
    isLoading,
    error
  };
}