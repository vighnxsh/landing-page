import { memo } from 'react';
import {  MetricLiquidity, MetricMcap } from './TokenMetric/TokenMetric';
import { cn } from '@/lib/utils2';

type TokenMetricsProps = {
  className?: string;
};

export const TokenMetrics: React.FC<TokenMetricsProps> = memo(({ className }) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <MetricMcap className="text-xl px-2 rounded-lg" />
      {/* <MetricFdv className="text-xl px-2 rounded-lg" /> */}
      <MetricLiquidity className="text-xl  px-2 rounded-lg" />
    </div>
  );
});

TokenMetrics.displayName = 'TokenMetrics';
