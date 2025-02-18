import React from 'react';
import { CoinGeckoMarket } from '../types/dex';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Flame } from 'lucide-react';

interface TrendingTokensProps {
  tokens: CoinGeckoMarket[];
  isLoading: boolean;
}

const TrendingTokens: React.FC<TrendingTokensProps> = ({ tokens, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center mb-6">
        <Flame className="w-5 h-5 text-orange-500 mr-2" />
        <h2 className="text-lg font-semibold">Trending Tokens</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tokens.slice(0, 3).map((token) => (
          <div key={token.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img src={token.image} alt={token.name} className="w-8 h-8 mr-2" />
                <div>
                  <h3 className="font-medium">{token.symbol.toUpperCase()}</h3>
                  <p className="text-sm text-gray-500">{token.name}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                token.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {token.price_change_percentage_24h >= 0 ? '+' : ''}
                {token.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
            <div className="mt-2">
              <p className="text-lg font-semibold">${token.current_price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                Vol: ${token.total_volume.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTokens;