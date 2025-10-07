import { useMinimalTokenInfo, useTokenInfo } from '@/hooks/queries';
import { cn } from '@/lib/utils2';
import { memo } from 'react';
import { ReadableNumber } from '../ui/ReadableNumber';
import { formatReadablePercentChange } from '@/lib/format/number';
import { Copyable } from '../ui/Copyable';
import { TruncatedAddress } from '../TruncatedAddress/TruncatedAddress';
import CopyIconSVG from '@/icons/CopyIconSVG';
import { TrenchesTokenIcon, TrenchesTokenIconImage } from '../TokenIcon';



import { useTokenAddress } from '@/hooks/queries';

import { BondingCurve } from './BondingCurve';



type TokenHeaderProps = {
  className?: string;
};

export const TokenHeader: React.FC<TokenHeaderProps> = memo(({ className }) => {
  const tokenId = useTokenAddress();
  const { data: pool } = useTokenInfo();
  const { data: minimalTokenInfo } = useMinimalTokenInfo();

  const pctChange =
    pool?.baseAsset.stats24h?.priceChange === undefined
      ? undefined
      : pool.baseAsset.stats24h.priceChange / 100;

  return (
    <div className={cn('flex items-center overflow-hidden w-full', className)}>
     
      <div className="relative mr-2 flex shrink-0 items-center rounded-lg bg-neutral-850">
       
        <TrenchesTokenIcon className="rounded-lg" token={minimalTokenInfo}>
      
          <TrenchesTokenIconImage className="rounded-lg" />
     
        </TrenchesTokenIcon>
      
      </div>

      <div className="flex flex-1 justify-between gap-2.5 overflow-hidden">
        <div className="flex flex-col justify-center gap-0.5">
          <h1 className="cursor-pointer truncate font-bold text-2xl leading-none tracking-tight">
            {minimalTokenInfo?.symbol}
          </h1>
        

          {minimalTokenInfo && (
            <Copyable
              name="Address"
              copyText={minimalTokenInfo.address}
              className={cn(
                'flex min-w-0 items-center gap-0.5  text-neutral-500 duration-200 hover:text-neutral-400 font-bold text-xl'
              )}
            >
              {(copied) => (
                <>
                  <TruncatedAddress
                    className={cn(
                      'min-w-0 overflow-hidden text-clip whitespace-nowrap leading-none tracking-tight font-bold text-xl',
                      {
                        'text-primary': copied,
                      }
                    )}
                    address={minimalTokenInfo.address}
                  />
                  {copied ? (
                    <span className="iconify shrink-0 text-primary ph--check-bold" />
                  ) : (
                    <CopyIconSVG className="shrink-0" width={11} height={11} />
                  )}
                </>
              )}
            </Copyable>
          )}
          
          
        </div>
        {minimalTokenInfo?.address && (
          <a
            href={`/creator-profile/${minimalTokenInfo.address}`}
            className="ml-4 self-center px-3 py-1 rounded-lg bg-pink-100 text-pink-600 text-xl font-semibold hover:bg-pink-200 transition-colors duration-200 whitespace-nowrap shadow-sm border border-pink-200"
            title="View Creator Profile"
          >
            Creator page 👀
          </a>
        )}
        <div className="flex flex-col gap-2">
          <BondingCurve key={`bonding-curve-${tokenId}`} className="px-2.5" />
          <div className="flex flex-col gap-2">
        
          </div>
          </div>

        <div className={cn('flex flex-col items-end justify-center gap-0.5', className)}>
       
          <ReadableNumber
            className="leading-none tracking-tight font-bold text-xl"
            format="price"
            num={pool?.baseAsset.usdPrice ?? 0.0003}
            prefix="$"
            animated
            showDirection
          />
        
          <div
            className={cn(
              'leading-none font-bold text-xl',
              pctChange !== undefined && pctChange < 0
                ? 'text-red-500'
                : pctChange !== undefined && pctChange > 0
                ? 'text-green-500'
                : ''
            )}
          >
            {formatReadablePercentChange(pctChange, { hideSign: 'positive' })}
          </div>
         
        </div>
      </div>
    </div>
  );
});

TokenHeader.displayName = 'TokenHeader';
