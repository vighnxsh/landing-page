"use client";

import React, { memo, useState } from 'react';
import { useTokenInfo } from '@/hooks/queries';

type TokenStatsProps = {
  className?: string;
};

const TF = {
  MIN_5: '5m',
  HOUR_1: '1h',
  HOUR_6: '6h',
  HOUR_24: '24h',
} as const;

export const TokenStats: React.FC<TokenStatsProps> = memo(({ className }) => {
  const [tf, setTf] = useState<typeof TF[keyof typeof TF]>('24h');
  const { data: stats24h } = useTokenInfo((d) => d?.baseAsset?.stats24h);
  const { data: stats6h } = useTokenInfo((d) => d?.baseAsset?.stats6h);
  const { data: stats1h } = useTokenInfo((d) => d?.baseAsset?.stats1h);
  const { data: stats5m } = useTokenInfo((d) => d?.baseAsset?.stats5m);

  const pick = () => {
    switch (tf) {
      case '5m': return stats5m;
      case '1h': return stats1h;
      case '6h': return stats6h;
      default: return stats24h;
    }
  };
  const current = pick();
  const pct = current?.priceChange === undefined ? undefined : current.priceChange / 100;
  const pctText = pct === undefined ? '--' : `${pct >= 0 ? '+' : ''}${(pct * 100).toFixed(2)}%`;

  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <div className="inline-flex border border-gray-800">
        {(['5m','1h','6h','24h'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTf(k)}
            className={`px-2 py-1 text-xs ${tf===k? 'bg-gray-900 text-white':'text-gray-300 hover:bg-gray-900/60'}`}
          >
            {k}
          </button>
        ))}
      </div>
      <div className={`text-sm font-semibold ${pct === undefined ? 'text-gray-400' : pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pctText}</div>
    </div>
  );
});

TokenStats.displayName = 'TokenStats';


