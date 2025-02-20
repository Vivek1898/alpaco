import { NextResponse } from 'next/server';

const API_KEY = '74366121-4704-4f6f-8e78-6515c182cc5a';
const BASE_URL = 'https://pro-api.coinmarketcap.com';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const networkId = searchParams.get('network_id');
    const start = searchParams.get('start') || '1';
    const limit = searchParams.get('limit') || '50';
    const sort = searchParams.get('sort') || 'volume_24h';
    const sort_dir = searchParams.get('sort_dir') || 'desc';

    const queryParams = new URLSearchParams({
      start,
      limit,
      sort,
      sort_dir,
      ...(networkId && { network_id: networkId }),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${BASE_URL}/v4/dex/listings/quotes?${queryParams}`, {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout' },
          { status: 504 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from CoinMarketCap' },
      { status: 500 }
    );
  }
}