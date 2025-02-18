import axios from 'axios';
import { SearchResponse, CoinGeckoMarket, TokenProfile, DexMarketStats } from '../types/dex';

const DEX_BASE_URL = 'https://api.dexscreener.com/latest/dex';
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const searchPairs = async (query: string): Promise<SearchResponse> => {
  const response = await axios.get(`${DEX_BASE_URL}/search?q=${query}`);
  return response.data;
};

export const getTopTokens = async (): Promise<CoinGeckoMarket[]> => {
  const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  );
  return response.data;
};

export const getTokenProfiles = async (): Promise<TokenProfile[]> => {
  const response = await axios.get(`https://api.dexscreener.com/token-profiles/latest/v1`);
  console.log(response)
  return response.data;
};

// Simulated market stats since the actual endpoint isn't available
export const getMarketStats = async (): Promise<DexMarketStats> => {
  return {
    volume24h: 1790000000, // $1.79B
    transactions24h: 2450000,
    newPairs24h: 156
  };
};