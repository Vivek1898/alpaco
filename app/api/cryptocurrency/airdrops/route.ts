import { NextResponse } from 'next/server';

const API_KEY = '74366121-4704-4f6f-8e78-6515c182cc5a';
const BASE_URL = 'https://pro-api.coinmarketcap.com';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status')?.toUpperCase() || 'ONGOING';
    const limit = searchParams.get('limit') || '10';
    const start = searchParams.get('start') || '1';
    const symbol = searchParams.get('symbol');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    // Build query parameters
    const queryParams = new URLSearchParams({
      status,
      limit,
      start,
    });

    if (symbol) queryParams.append('symbol', symbol);
    if (slug) queryParams.append('slug', slug);
    if (id) queryParams.append('id', id);

    const response = await fetch(
      `${BASE_URL}/v1/cryptocurrency/airdrops?${queryParams.toString()}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
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
      { 
        error: 'Failed to fetch airdrop data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}