import { NextResponse } from 'next/server';

const API_KEY = '74366121-4704-4f6f-8e78-6515c182cc5a';
const BASE_URL = 'https://pro-api.coinmarketcap.com';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const time_period = searchParams.get('time_period') || '24h';
    const convert = searchParams.get('convert') || 'USD';

    const response = await fetch(
      `${BASE_URL}/v1/cryptocurrency/trending/latest?limit=${limit}&time_period=${time_period}&convert=${convert}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
          'Accept': 'application/json',
        },
        next: { revalidate: 600 } // Cache for 10 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from CoinMarketCap' },
      { status: 500 }
    );
  }
}