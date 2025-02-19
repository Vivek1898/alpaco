import { NextResponse } from 'next/server';

const API_KEY = '74366121-4704-4f6f-8e78-6515c182cc5a';
const BASE_URL = 'https://pro-api.coinmarketcap.com';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const endpoints = [
      // Cryptocurrency data
      { path: '/v1/cryptocurrency/airdrop', name: 'airdrops' },
      { path: '/v1/cryptocurrency/categories', name: 'categories' },
      { path: '/v1/cryptocurrency/map', name: 'cryptoMap' },
      { path: '/v2/cryptocurrency/info?symbol=BTC,ETH', name: 'metadata' },
      { path: '/v1/cryptocurrency/listings/latest?limit=10', name: 'latestListings' },
      { path: '/v1/cryptocurrency/listings/new?limit=10', name: 'newListings' },
      { path: '/v1/cryptocurrency/trending/gainers-losers?limit=10', name: 'trendingGainersLosers' },
      { path: '/v1/cryptocurrency/trending/latest?limit=10', name: 'trendingLatest' },
      { path: '/v1/cryptocurrency/trending/most-visited?limit=10', name: 'trendingMostVisited' },
      { path: '/v3/fear-and-greed/latest', name: 'fearAndGreed' },
    ];

    const responses = await Promise.allSettled(
      endpoints.map(endpoint => 
        fetch(`${BASE_URL}${endpoint.path}`, {
          headers: {
            'X-CMC_PRO_API_KEY': API_KEY,
            'Accept': 'application/json',
          },
          next: { revalidate: 60 } // Cache for 1 minute
        })
      )
    );

    const data: Record<string, any> = {};

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const endpoint = endpoints[i];

      if (response.status === 'fulfilled' && response.value.ok) {
        const json = await response.value.json();
        data[endpoint.name] = json.data;
      } else {
        console.error(`Failed to fetch ${endpoint.name}:`, 
          response.status === 'rejected' ? response.reason : 'API Error');
        data[endpoint.name] = null;
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from CoinMarketCap' },
      { status: 500 }
    );
  }
}