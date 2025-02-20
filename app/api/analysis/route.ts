import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { symbol, data } = await request.json();

    if (!symbol || !data) {
      return NextResponse.json(
        { error: 'Symbol and data are required' },
        { status: 400 }
      );
    }

    const prompt = `
      As Alpaca AI, analyze the following cryptocurrency data for ${symbol} and provide a concise, professional analysis in exactly 10 points. Use sophisticated financial terminology and maintain a formal tone.

      Data:
      - Technical Indicators: RSI (${data.technical?.rsi}), MACD (${data.technical?.macd}), CCI (${data.technical?.cci}), MFI (${data.technical?.mfi})
      - Social Metrics: Positive (${(data.social?.positive * 100).toFixed(2)}%), Negative (${(data.social?.negative * 100).toFixed(2)}%), Volume Score (${(data.social?.volume_score * 100).toFixed(2)}%)
      - Market Data: Price ($${data.price}), 24h Change (${data.priceChange}%), Market Cap ($${data.marketCap}), Volume ($${data.volume})
      - Fear & Greed Index: ${data.fearAndGreed?.value} (${data.fearAndGreed?.value_classification})

      Format the response as follows:
      # ALPACA MARKET INTELLIGENCE REPORT: ${symbol}

      1. [Technical Synopsis] - Start with key technical indicator analysis
      2. [Momentum Analysis] - Evaluate price momentum and trend strength
      3. [Volume Profile] - Analyze trading volume patterns
      4. [Market Sentiment] - Interpret social and market sentiment
      5. [Risk Assessment] - Evaluate current risk levels
      6. [Short-term Outlook] - Provide 24-48 hour projection
      7. [Support/Resistance] - Identify key price levels
      8. [Volatility Forecast] - Predict potential price volatility
      9. [Market Position] - Evaluate overall market positioning
      10. [Strategic Advisory] - Provide actionable trading insights

      Use sophisticated terms like "confluence", "price action", "market structure", "liquidity zones", etc. Keep each point concise but impactful.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({
      analysis: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    );
  }
}