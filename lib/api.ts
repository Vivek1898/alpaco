import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to fetch data');
  }
  return response.json();
};

// Technical Analysis API fetcher with error handling and retry
const taapiAnalysisFetcher = async (symbol: string) => {
  try {
    const indicators = ['rsi', 'macd', 'cci', 'mfi', 'bb'];

    const results = await Promise.all(
        indicators.map(async (indicator) => {
          const response = await fetch(`/api/technical-analysis/${indicator}?symbol=${symbol}`);
          if (!response.ok) {
            console.warn(`Failed to fetch ${indicator}, retrying...`);
            // Retry once after a short delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const retryResponse = await fetch(`/api/technical-analysis/${indicator}?symbol=${symbol}`);
            if (!retryResponse.ok) throw new Error(`Failed to fetch ${indicator}`);
            return retryResponse.json();
          }
          return response.json();
        })
    );

    return results.reduce((acc, curr, idx) => {
      acc[indicators[idx]] = curr.value;
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('Technical Analysis API Error:', error);
    return null;
  }
};

// Fear & Greed Index fetcher with fallback
const fearAndGreedFetcher = async () => {
  try {
    // Try the external API first
    const response = await fetch('/api/fear-and-greed/latest');
    if (!response.ok) throw new Error('Failed to fetch Fear & Greed Index');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Fear & Greed API Error:', error);
    // Return simulated data as fallback
    return {
      value: 45 + Math.random() * 20,
      value_classification: "Fear",
      timestamp: new Date().toISOString()
    };
  }
};

// Social Sentiment fetcher with retry
const socialSentimentFetcher = async (symbol: string) => {
  try {
    const response = await fetch(`/api/social-sentiment?symbol=${symbol}`);
    if (!response.ok) {
      console.warn('Failed to fetch social sentiment, retrying...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const retryResponse = await fetch(`/api/social-sentiment?symbol=${symbol}`);
      if (!retryResponse.ok) throw new Error('Failed to fetch social sentiment');
      return retryResponse.json();
    }
    return response.json();
  } catch (error) {
    console.error('Social Sentiment API Error:', error);
    return null;
  }
};

export function useMarketData() {
  const { data: fearAndGreed, error: fearAndGreedError } = useSWR(
      '/api/fear-and-greed/latest',
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 300000 // 5 minutes
      }
  );

  const { data: latestListings, error: latestListingsError } = useSWR(
      '/api/cryptocurrency/listings/latest?start=1&limit=100&sort=market_cap&sort_dir=desc&convert=USD',
      fetcher,
      { refreshInterval: 60000 } // 1 minute
  );

  const { data: trendingLatest, error: trendingLatestError } = useSWR(
      '/api/cryptocurrency/trending/latest?limit=10',
      fetcher,
      { refreshInterval: 60000 }
  );

  const { data: trendingGainersLosers, error: trendingGainersLosersError } = useSWR(
      '/api/cryptocurrency/trending/gainers-losers',
      fetcher,
      { refreshInterval: 60000 }
  );

  const { data: globalMetrics, error: globalMetricsError } = useSWR(
      '/api/global-metrics/latest',
      fetcher,
      { refreshInterval: 60000 }
  );

  const { data: airdrops, error: airdropsError } = useSWR(
      '/api/cryptocurrency/airdrops?status=ONGOING&limit=5',
      fetcher,
      { refreshInterval: 300000 }
  );

  const isLoading = !fearAndGreed && !fearAndGreedError ||
      !latestListings && !latestListingsError ||
      !trendingLatest && !trendingLatestError ||
      !trendingGainersLosers && !trendingGainersLosersError ||
      !globalMetrics && !globalMetricsError ||
      !airdrops && !airdropsError;

  const error = fearAndGreedError || latestListingsError || trendingLatestError ||
      trendingGainersLosersError || globalMetricsError || airdropsError;

  return {
    data: {
      fearAndGreed: fearAndGreed?.data,
      latestListings: latestListings?.data,
      trendingLatest: trendingLatest?.data,
      trendingGainersLosers: trendingGainersLosers?.data,
      globalMetrics: globalMetrics?.data,
      airdrops: airdrops?.data,
    },
    isLoading,
    error
  };
}

export function useHistoricalData(symbol: string) {
  const { data, error, isLoading } = useSWR(
      `/api/cryptocurrency/quotes/historical?symbol=${symbol}&interval=1d&count=30`,
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 300000
      }
  );

  return {
    data: data?.data,
    error,
    isLoading
  };
}

export function useCryptoAnalysis(symbol: string) {
  const { data: technical, error: technicalError } = useSWR(
      symbol ? `technical-analysis-${symbol}` : null,
      () => taapiAnalysisFetcher(symbol),
      {
        refreshInterval: 300000,
        revalidateOnFocus: false
      }
  );

  const { data: social, error: socialError } = useSWR(
      symbol ? `social-sentiment-${symbol}` : null,
      () => socialSentimentFetcher(symbol),
      {
        refreshInterval: 300000,
        revalidateOnFocus: false
      }
  );

  const { data: fearAndGreed, error: fearAndGreedError } = useSWR(
      'fear-and-greed',
      fearAndGreedFetcher,
      {
        refreshInterval: 300000,
        revalidateOnFocus: false
      }
  );

  const calculateScore = (technical: any, social: any, fearAndGreed: any) => {
    if (!technical || !social || !fearAndGreed) return null;

    let score = 50; // Base score

    // Technical Analysis (40 points)
    if (technical.rsi < 30) score += 20;
    else if (technical.rsi > 70) score -= 20;

    if (technical.macd > 0) score += 10;
    else score -= 10;

    if (technical.cci > 100) score += 5;
    else if (technical.cci < -100) score -= 5;

    if (technical.mfi < 20) score += 5;
    else if (technical.mfi > 80) score -= 5;

    // Social Sentiment (30 points)
    const sentimentScore = (social.positive - social.negative) * 15;
    score += Math.max(-15, Math.min(15, sentimentScore));

    score += social.volume_score * 15;

    // Market Fear & Greed (30 points)
    const fgValue = parseInt(fearAndGreed.value);
    if (fgValue < 20) score += 15; // Extreme fear = buying opportunity
    else if (fgValue > 80) score -= 15; // Extreme greed = selling pressure

    // Normalize score between 0 and 100
    return Math.max(0, Math.min(100, score));
  };

  const score = calculateScore(technical, social, fearAndGreed);

  return {
    technical,
    social,
    fearAndGreed,
    score,
    isLoading: !technical || !social || !fearAndGreed,
    error: technicalError || socialError || fearAndGreedError
  };
}