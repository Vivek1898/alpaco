import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Simulate social sentiment data
    // In production, you would integrate with a real sentiment API
    const sentiment = {
      positive: Math.random() * 0.7 + 0.3, // 30-100% positive
      negative: Math.random() * 0.3, // 0-30% negative
      neutral: Math.random() * 0.4, // 0-40% neutral
      volume_score: Math.random(), // 0-1 volume score
      sources: {
        twitter: Math.random(),
        reddit: Math.random(),
        telegram: Math.random()
      }
    };

    return NextResponse.json(sentiment);
  } catch (error) {
    console.error('Social Sentiment API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social sentiment data' },
      { status: 500 }
    );
  }
}