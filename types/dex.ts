// export interface TokenPair {
//   chainId: string;
//   dexId: string;
//   url: string;
//   pairAddress: string;
//   priceNative: string;
//   priceUsd: string;
//   fdv: number;
//   marketCap: number;
//   pairCreatedAt: number;
//   labels: string[];
//   volume: {
//     [key: string]: number;
//   };
//   priceChange: {
//     [key: string]: number;
//   };
//   baseToken: {
//     address: string;
//     name: string;
//     symbol: string;
//   };
//   quoteToken: {
//     address: string;
//     name: string;
//     symbol: string;
//   };
//   liquidity: {
//     usd: number;
//     base: number;
//     quote: number;
//   };
//   txns: {
//     [key: string]: {
//       buys: number;
//       sells: number;
//     };
//   };
// }

export interface SearchResponse {
  schemaVersion: string;
  pairs: TokenPair[];
}

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}




export interface TokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  header: string;
  description: string;
  links: {
    type: string;
    label: string;
    url: string;
  }[];
}

export interface DexMarketStats {
  volume24h: number;
  transactions24h: number;
  newPairs24h: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: string;
  url: string;
}

export interface TokenPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceChange: {
    '24h': number;
  };
  liquidity: {
    usd: number;
  };
  volume: {
    '24h': number;
  };
  marketCap?: number;
}

export interface SearchResponse {
  pairs: TokenPair[];
}

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}