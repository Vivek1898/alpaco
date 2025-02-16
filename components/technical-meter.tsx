"use client";

import { Card } from "./ui/card";

interface TechnicalMeterProps {
  symbol: string;
  timeframe: "1min" | "5min" | "15min" | "30min" | "1hour" | "4hour" | "1day";
  buySignals: number;
  sellSignals: number;
  neutralSignals: number;
}

export function TechnicalMeter({ 
  symbol, 
  timeframe, 
  buySignals, 
  sellSignals, 
  neutralSignals 
}: TechnicalMeterProps) {
  const total = buySignals + sellSignals + neutralSignals;
  const buyPercentage = (buySignals / total) * 100;
  const sellPercentage = (sellSignals / total) * 100;
  
  // Calculate the position of the indicator needle (0-180 degrees)
  // -90 to 90 range where:
  // -90 = strong sell
  // 0 = neutral
  // 90 = strong buy
  const calculateNeedleRotation = () => {
    const buyWeight = (buySignals / total) * 2; // 0 to 2
    const sellWeight = (sellSignals / total) * 2; // 0 to 2
    return (buyWeight - sellWeight) * 90; // -90 to 90
  };

  const needleRotation = calculateNeedleRotation();
  
  // Determine the overall signal
  const determineSignal = () => {
    if (buySignals > sellSignals && buySignals > neutralSignals) {
      return { text: "Buy", color: "text-green-500" };
    } else if (sellSignals > buySignals && sellSignals > neutralSignals) {
      return { text: "Sell", color: "text-red-500" };
    } else {
      return { text: "Neutral", color: "text-gray-500" };
    }
  };

  const signal = determineSignal();

  return (
    <Card className="p-4 bg-white">
      <div className="text-sm font-medium mb-2">
        Technical Analysis for {symbol} ({timeframe})
      </div>
      
      {/* Meter */}
      <div className="relative w-full h-[120px] mb-4">
        {/* Semicircle background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-gradient-to-r from-red-500 via-gray-300 to-green-500 rounded-t-full overflow-hidden opacity-20" />
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-[90px] bg-primary origin-bottom transition-transform duration-300"
          style={{ transform: `rotate(${needleRotation}deg)` }}
        />
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-red-500">Strong sell</div>
        <div className="absolute bottom-0 right-0 text-xs text-green-500">Strong buy</div>
      </div>

      {/* Signal */}
      <div className="text-center mb-4">
        <span className={`text-lg font-bold ${signal.color}`}>
          {signal.text}
        </span>
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="text-red-500 font-medium">Sell</div>
          <div className="text-red-500">{sellSignals}</div>
        </div>
        <div>
          <div className="text-gray-500 font-medium">Neutral</div>
          <div className="text-gray-500">{neutralSignals}</div>
        </div>
        <div>
          <div className="text-green-500 font-medium">Buy</div>
          <div className="text-green-500">{buySignals}</div>
        </div>
      </div>
    </Card>
  );
}