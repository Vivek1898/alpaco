import React from 'react';
import { TokenPair } from '../types/dex';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TokenCardProps {
  pair: TokenPair;
}

const TokenCard: React.FC<TokenCardProps> = ({ pair }) => {
  const priceChange24h = pair?.priceChange['24h'] || 0;
  const isPositive = priceChange24h >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{`${pair?.baseToken?.symbol}/${pair?.quoteToken?.symbol}`}</h3>
          <p className="text-sm text-gray-500">{pair?.dexId}</p>
        </div>
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpCircle className="w-4 h-4 mr-1" /> : <ArrowDownCircle className="w-4 h-4 mr-1" />}
          <span className="font-medium">{`${priceChange24h?.toFixed(2)}%`}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Price USD</p>
          <p className="font-medium">${parseFloat(pair?.priceUsd).toFixed(6)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Liquidity</p>
          <p className="font-medium">${pair?.liquidity?.usd?.toLocaleString() || `--`}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Volume 24h</p>
          <p className="font-medium">${pair?.volume['24h']?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Market Cap</p>
          <p className="font-medium">${pair.marketCap?.toLocaleString() || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;