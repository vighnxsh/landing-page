import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

type PoolFeeData = {
  current: {
    partnerBaseFee: string;
    partnerQuoteFee: string;
  };
  total: {
    totalTradingBaseFee: string;
    totalTradingQuoteFee: string;
  };
};

type PartnerPool = {
  poolAddress: string;
  configAddress: string;
  poolData: any;
  configData: any;
  fees: PoolFeeData | null;
};

export function usePartnerPools() {
  const [pools, setPools] = useState<PartnerPool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { publicKey } = useWallet();

  const fetchPartnerPools = async () => {
    if (!publicKey) {
      setPools([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/get-partner-pools?feeClaimerAddress=${publicKey.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch partner pools');
      }

      const { pools: partnerPools } = await response.json();
      setPools(partnerPools);
    } catch (error: any) {
      setError(error);
      console.error('Error fetching partner pools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPools = () => {
    fetchPartnerPools();
  };

  useEffect(() => {
    fetchPartnerPools();
  }, [publicKey]);

  // Calculate total fees across all pools
  const totalFees = pools.reduce(
    (acc, pool) => {
      if (pool.fees) {
        acc.partnerBaseFee += parseFloat(pool.fees.current.partnerBaseFee) || 0;
        acc.partnerQuoteFee += parseFloat(pool.fees.current.partnerQuoteFee) || 0;
      }
      return acc;
    },
    { partnerBaseFee: 0, partnerQuoteFee: 0 }
  );

  return {
    pools,
    isLoading,
    error,
    refreshPools,
    totalFees,
  };
} 