'use client';

import { DevFunApp } from '@/types/devfun';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiUser, FiLink } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface AppCardProps {
  app: DevFunApp;
}

export function AppCard({ app }: AppCardProps) {
  const router = useRouter();
  const formatMarketCap = (marketcap: number) => {
    if (marketcap >= 1000000) {
      return `$${(marketcap / 1000000).toFixed(1)}M`;
    } else if (marketcap >= 1000) {
      return `$${(marketcap / 1000).toFixed(1)}K`;
    }
    return `$${marketcap.toFixed(0)}`;
  };

  const formatPriceChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };


  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800/50 to-black rounded-none p-4 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10"
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/app/${app.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/app/${app.id}`);
        }
      }}
    >
      {/* Likes badge */}
      <div className="absolute top-2 right-2 z-20">
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-pink-300 rounded-none animate-pulse">
          <FiHeart className="text-pink-400" />
          {app.likeCount}
        </span>
      </div>

      {/* Top row */}
      <div className="flex gap-4 items-start">
       
        <div className="w-20 h-20 bg-gray-800 rounded-none relative overflow-hidden flex items-center justify-center z-10">
          <Image src={app.cover} alt={app.name} fill className="object-cover transition-opacity duration-200 group-hover:opacity-60" />
          {/* fade half the image on hover (right half to transparent) */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>
        <div className="flex-1 min-w-0">
          
          
          <div className="flex items-center gap-3">
            <h3 className="flex-1 min-w-0 text-white text-xl font-black tracking-[-0.03em] truncate">{app.name}</h3>
            <div className="ml-auto flex items-center gap-4 text-base">
              <span className="flex items-center gap-2 text-green-400">
                <FiUser />
                <span>{app.runsCount}</span>
              </span>
              <span className="flex items-center gap-2 text-pink-300">
                <FiHeart />
                <span>{app.likeCount}</span>
              </span>
            </div>
          </div>
          <p className="text-gray-400 mt-1 text-sm truncate">{app.description}</p>
        </div>
      </div>

      <div className="border-t border-gray-800 transition-all my-3 z-10 relative"></div>

      {/* Bottom row */}
      {app.token ? (
        <div className="mt-1 relative h-14 z-10 overflow-hidden">
          {/* default: ticker + description */}
          <div className="flex items-center gap-3 transition-opacity duration-200 opacity-100 group-hover:opacity-0 whitespace-nowrap">
            <span className="inline-block px-2 py-0.5 text-sm text-white">${app.token.symbol.toUpperCase()}</span>
            <p className="text-gray-300 text-xs truncate flex-1">{app.description}</p>
          </div>
          {/* hover: stats */}
          <div className="absolute inset-x-0 bottom-0 h-full flex items-center justify-between gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2">
            <div className="pl-0 pointer-events-none whitespace-nowrap leading-none">
              <div className="text-[11px] text-gray-300">Vol:</div>
              <div className="text-emerald-400 font-bold text-sm">{formatMarketCap(app.token.volumeIn24h)}</div>
            </div>
            <div className="text-left flex-1 pointer-events-none leading-none">
              <div className="text-[11px] text-gray-300">mcap:</div>
              <div className={`font-extrabold ${ (app.token.priceChangeIn24h ?? 0) < 0 ? 'text-red-400' : (app.token.priceChangeIn24h ?? 0) > 0 ? 'text-green-400' : 'text-gray-400'} text-base whitespace-nowrap`}>
                {formatMarketCap(app.token.marketcap)}{' '}
                <span className={` text-[11px] ${(app.token.priceChangeIn24h ?? 0) > 0 ? 'text-green-400' : (app.token.priceChangeIn24h ?? 0) < 0 ? 'text-red-400' : 'text-gray-400'}`}>[{formatPriceChange(app.token.priceChangeIn24h ?? 0)}]</span>
              </div>
            </div>
            <div className="pr-1 pointer-events-auto">
              {app.website ? (
                <Link
                  href={app.website}
                  target="_blank"
                  className="inline-flex items-center justify-center w-8 h-8 bg-gray-800 text-gray-300 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiLink />
                </Link>
              ) : app.token?.website ? (
                <Link
                  href={app.token.website}
                  target="_blank"
                  className="inline-flex items-center justify-center w-8 h-8 bg-gray-800 text-gray-300 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiLink />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-500">No token information available</div>
      )}
    </div>
  );
}

