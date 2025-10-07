'use client';

import { DevFunApp } from '@/types/devfun';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHeart, FiUser, FiLink } from 'react-icons/fi';

interface FeaturedAppCardProps {
  app: DevFunApp;
}

function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

function formatPercent(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

export function FeaturedAppCard({ app }: FeaturedAppCardProps) {

  const progress = Math.max(0, Math.min(100, Math.round(((app.token?.bondingCurveProgress || 0) * 100))));
  const router = useRouter();
  const marketcap = app.token?.marketcap || 0;
  const volume = app.token?.volumeIn24h || 0;
  const change = app.token?.priceChangeIn24h || 0;

  return (
    <div
      className=" rounded-md relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800/50 to-black  m-2 p-2 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10 border border-gray-800 group-hover:border-black"
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
      {/* Hover gradient background */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${
          change < 0 ? 'from-red-500/20 via-red-500/5' : 'from-emerald-500/20 via-emerald-500/5'
        } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Likes badge top-right */}
      <div className="absolute top-2 right-2 z-20">
        <span className="inline-flex items-center gap-1 px-2 py-1 text-md text-pink-300 rounded-none ">
          <FiHeart className="text-pink-400" />
          {app.likeCount}
        </span>
      </div>
      <div className="flex gap-4 items-start">
        {/* Poster (match FeaturedProjectCard sizing) */}
        <div className="relative w-24 h-24 rounded-none overflow-hidden  flex-shrink-0 border border-gray-800 bg-gray-900">
          <Image src={app.cover} alt={app.name} fill className="object-cover" />
          {/* Small badges bottom-left (mock) */}
          <div className="absolute bottom-2 left-2 flex gap-2">
            {/* {app.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-1 rounded-full text-xs bg-black/60 border border-gray-700 text-gray-300">
                {tag}
              </span>
            ))} */}
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-3">
            <h3 className="flex-1 min-w-0 text-white text-xl font-black tracking-[-0.03em] truncate">
              {app.name}
            </h3>
            {/* optional right-side metrics intentionally removed to match FeaturedProjectCard */}
          </div>

          {/* Author */}
          <div className="mt-2 text-green-400">
            {app.user.displayName}
          </div>

          {/* Description */}
          <p className="mt-1.5 text-gray-300 text-xs leading-relaxed line-clamp-2">
            {app.description}
          </p>

          {/* Spacer before bottom section */}
          <div className="mt-2" />

          {/* Progress hidden to match FeaturedProjectCard */}
          <div className="mt-4 z-10 relative" />
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t border-gray-800 transition-all my-3 z-10 relative`} />

      {/* Bottom row full-width (matches FeaturedProjectCard) */}
      {app.token && (
        <div className="mt-1 relative min-h-[44px] z-10">
          {/* default (not hovered): ticker + description */}
          <div className="flex items-center gap-3 transition-opacity duration-200 opacity-100 group-hover:opacity-0">
            <span className="inline-block px-2 py-0.5 text-xl text-white">${app.token.symbol.toUpperCase()}</span>
            <span className="text-green-300 text-md truncate flex-1 flex items-center gap-1">
              <FiUser className="inline-block text-green-400" />
              {app.runsCount.toLocaleString()} runs
            </span>
          </div>
          {/* hovered: show stats */}
          <div className="absolute inset-0 flex items-end justify-between gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pb-1">
            <div className="pl-1 pointer-events-none">
              <div className="text-xs text-gray-300">Vol:</div>
              <div className="text-emerald-400 font-bold text-base">{formatCurrencyShort(volume)}</div>
            </div>
            <div className="text-left flex-1 pointer-events-none">
              <div className="text-xs text-gray-300">mcap:</div>
              <div className={`font-extrabold  ${change < 0 ? 'text-red-400' : change > 0 ? 'text-green-400' : 'text-gray-400'} text-lg`}>
                {formatCurrencyShort(marketcap)}{' '}
                <span className={` text-md ${change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400'}`}>{formatPercent(change)}</span>
              </div>
            </div>
            <div className="pr-1 pointer-events-auto">
              {app.website ? (
                <Link
                  href={app.website}
                  target="_blank"
                  className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded bg-gray-800 border border-gray-700 text-gray-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiLink />
                </Link>
              ) : app.token?.website ? (
                <Link
                  href={app.token.website}
                  target="_blank"
                  className="pointer-events-auto inline-flex items-center justify-center w-10 h-10 rounded bg-gray-800 border border-gray-700 text-gray-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiLink />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeaturedAppCard;


