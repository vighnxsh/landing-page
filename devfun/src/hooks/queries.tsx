"use client";
import { useParams } from 'next/navigation';
import { NATIVE_MINT } from '@solana/spl-token';
import { ApeQueries, QueryData } from '@/components/Explore/queries';
import { useQuery } from '@tanstack/react-query';
import { formatPoolAsTokenInfo } from '@/components/Explore/pool-utils';

export function useTokenAddress() {
  const params = useParams();
  const tokenId = params.tokenId ?? NATIVE_MINT.toString();
  const address = Array.isArray(tokenId) ? tokenId[0] : tokenId;
  return address;
}

export function useTokenInfo<T = QueryData<typeof ApeQueries.tokenInfo>>(
  select?: (data: QueryData<typeof ApeQueries.tokenInfo>) => T
) {
  const tokenId = useTokenAddress();
  return useQuery({
    ...ApeQueries.tokenInfo({ id: tokenId }),
    refetchInterval: 60 * 1000,
    select,
  });
}

export function usePoolMinimalTokenInfo() {
  const tokenId = useTokenAddress();
  return useQuery({
    ...ApeQueries.tokenInfo({ id: tokenId }),
    select: (pool) => {
      if (!pool) {
        return;
      }
      return formatPoolAsTokenInfo(pool);
    },
    refetchInterval: 60 * 1000,
  });
}

export function useMinimalTokenInfo() {
  const main = usePoolMinimalTokenInfo();
  return main;
}
