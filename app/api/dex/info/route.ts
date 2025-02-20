import { NextResponse } from 'next/server';

const API_KEY = '74366121-4704-4f6f-8e78-6515c182cc5a';
const BASE_URL = 'https://pro-api.coinmarketcap.com';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'DEX ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BASE_URL}/v4/dex/listings/info?id=${id}&aux=urls,logo,description,date_launched,notice`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DEX information' },
      { status: 500 }
    );
  }
}