import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

type PoolFeeData = {
  current: {
    creatorBaseFee: string;
    creatorQuoteFee: string;
  };
  total: {
    totalTradingBaseFee: string;
    totalTradingQuoteFee: string;
  };
};

type CreatorPool = {
  poolAddress: string;
  poolData: any;
  fees: PoolFeeData | null;
};

export function useCreatorPools() {
  const [pools, setPools] = useState<CreatorPool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { publicKey } = useWallet();

  const fetchCreatorPools = async () => {
    if (!publicKey) {
      setPools([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/get-creator-pools?creatorAddress=${publicKey.toString()}`);
      console.log('Creator pools response:', response.status, response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Creator pools error data:', errorData);
        throw new Error(errorData.error || 'Failed to fetch creator pools');
      }

      const { pools: creatorPools } = await response.json();
      console.log('Creator pools data:', creatorPools);
      setPools(creatorPools);
    } catch (error: any) {
      console.error('Error fetching creator pools:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPools = () => {
    fetchCreatorPools();
  };

  useEffect(() => {
    fetchCreatorPools();
  }, [publicKey]);

  // Calculate total fees across all pools
  const totalFees = pools.reduce(
    (acc, pool) => {
      if (pool.fees) {
        acc.creatorBaseFee += parseFloat(pool.fees.current.creatorBaseFee) || 0;
        acc.creatorQuoteFee += parseFloat(pool.fees.current.creatorQuoteFee) || 0;
      }
      return acc;
    },
    { creatorBaseFee: 0, creatorQuoteFee: 0 }
  );

  return {
    pools,
    isLoading,
    error,
    refreshPools,
    totalFees,
  };
} 