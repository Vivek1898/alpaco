import { NextResponse } from 'next/server';

const API_KEY = '74366121-4704-4f6f-8e78-6515c182cc5a';
const BASE_URL = 'https://pro-api.coinmarketcap.com';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const lastScore = searchParams.get('last_score');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }

    const url = new URL(`${BASE_URL}/v1/${endpoint}`);
    if (lastScore) {
      url.searchParams.set('last_score', lastScore);
    }

    // Add limit parameter for trending endpoints
    if (endpoint.includes('trending')) {
      url.searchParams.set('limit', '5');
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Sanitize the response to ensure no Symbol objects
    const sanitizedData = JSON.parse(JSON.stringify(data));

    return NextResponse.json(sanitizedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from CoinMarketCap' },
      { status: 500 }
    );
  }
}