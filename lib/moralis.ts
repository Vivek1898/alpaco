import { API_KEYS } from './api-config';

export async function getTopGainers() {
  try {
    const response = await fetch(
      'https://deep-index.moralis.io/api/v2.2/discovery/tokens/top-gainers?chain=eth&min_market_cap=50000000&security_score=80&time_frame=1d',
      {
        headers: {
          'X-API-Key': API_KEYS.MORALIS_API_KEY,
          'Accept': 'application/json'
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    return [];
  }
}

export async function getTrendingTokens() {
  try {
    const response = await fetch(
      'https://deep-index.moralis.io/api/v2.2/discovery/tokens/trending?chain=eth&min_market_cap=50000000&security_score=80',
      {
        headers: {
          'X-API-Key': API_KEYS.MORALIS_API_KEY,
          'Accept': 'application/json'
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
}

export async function getMarketData() {
  try {
    const response = await fetch(
      'https://deep-index.moralis.io/api/v2.2/market-data/global/volume',
      {
        headers: {
          'X-API-Key': API_KEYS.MORALIS_API_KEY,
          'Accept': 'application/json'
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
}