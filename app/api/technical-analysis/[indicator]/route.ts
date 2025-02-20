import { NextResponse } from 'next/server';

// Simulate technical analysis data since we don't have a real API key
export async function GET(
  request: Request,
  { params }: { params: { indicator: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Simulate different indicators with realistic values
    let value;
    switch (params.indicator.toLowerCase()) {
      case 'rsi':
        value = 30 + Math.random() * 40; // RSI between 30 and 70
        break;
      case 'macd':
        value = -2 + Math.random() * 4; // MACD between -2 and 2
        break;
      case 'cci':
        value = -150 + Math.random() * 300; // CCI between -150 and 150
        break;
      case 'mfi':
        value = 20 + Math.random() * 60; // MFI between 20 and 80
        break;
      case 'bb':
        value = {
          upper: 100 + Math.random() * 20,
          middle: 100,
          lower: 80 - Math.random() * 20
        };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid indicator' },
          { status: 400 }
        );
    }

    return NextResponse.json({ value });
  } catch (error) {
    console.error('Technical Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch technical analysis data' },
      { status: 500 }
    );
  }
}