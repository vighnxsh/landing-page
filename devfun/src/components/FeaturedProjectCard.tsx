'use client';

import { DevFunProject } from '@/types/devfun';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiUser, FiHeart, FiSmartphone } from 'react-icons/fi';

interface FeaturedProjectCardProps {
  project: DevFunProject;
}

function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

// Modified: Use up/down arrows and remove square brackets
function formatPercent(change: number): string {
  if (change > 0) {
    return `↑${change.toFixed(2)}%`;
  } else if (change < 0) {
    return `↓${Math.abs(change).toFixed(2)}%`;
  } else {
    return `0.00%`;
  }
}

function formatCountShort(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const router = useRouter();
  // Handle null token case
  if (!project.token) {
    return (
      <div
        className="border border-gray-100 bg-gray-200  p-4 cursor-pointer group transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10"
        role="link"
        tabIndex={0}
        onClick={() => router.push(`/project/${project.id}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push(`/project/${project.id}`);
          }
        }}
      >
        {/* Top row */}
        <div className="flex gap-4 items-start">
         
          <div className="w-20 h-20 bg-gray-800 border border-gray-800 rounded-sm relative overflow-hidden flex items-center justify-center">
            {project.image ? (
              <Image src={project.image} alt={project.name} fill className="object-cover" />
            ) : (
              <span className="text-gray-600 text-3xl">{project.name[0]}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="flex-1 min-w-0 text-white text-2xl font-black tracking-[-0.03em] truncate">{project.name}</h3>
             
            </div>
            <p className="text-gray-400 mt-2 truncate">{project.oneliner}</p>
          </div>
        </div>
        {/* No token footer when token is missing: show nothing */}
      </div>
    );
  }

  const marketcap = project.token.marketcap;
  const volume = project.token.volumeIn24h;
  const change = project.token.priceChangeIn24h;

  return (
      <div
      className={`relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800/50 to-black rounded-none p-4 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/10 border border-gray-800 group-hover:border-black`}
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/project/${project.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/project/${project.id}`);
        }
      }}
    >
      {/* Hover gradient background - green when up, red when down */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${
          change < 0 ? 'from-red-500/20 via-red-500/5' : 'from-emerald-500/20 via-emerald-500/5'
        } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Likes badge top-right */}
      <div className="absolute top-2 right-2 z-20">
        <span className="inline-flex items-center gap-1 px-2 py-1 text-md text-pink-300 rounded-none ">
          <FiHeart fill="pink" className="text-pink-400" />
          {formatCountShort(project.likesCount)}
        </span>
      </div>

      {/* Top row */}
      <div className="flex gap-4 items-start">
        <div className={`w-24 h-24 bg-gray-900 border border-gray-800 rounded-none relative overflow-hidden flex items-center justify-center z-10 transition-all`}>
          
           
           <Image src={project.image} alt={project.name} fill className="object-cover" />
          
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="flex-1 min-w-0 text-white text-xl font-black tracking-[-0.03em] truncate">{project.name}</h3>
          
           
          </div>
          <div className="ml-auto  items-center gap-4 text-base">
              <span className="flex items-center gap-2 text-green-400">
                  <FiUser fill="green" className="text-green-400" />
                
                <span>{formatCountShort(project.runsCount)} <span className="text-green-400">runs</span></span>
              </span>
              <span className="flex items-center gap-2 text-yellow-200">
                <span>{formatCountShort(project.appCount)} apps</span>
                <FiSmartphone className="text-yellow-400" />
              </span>
            </div>
         
         </div>
      </div>

      <div className={`border-t border-gray-800 transition-all my-3 z-10 relative`}></div>

      {/* Bottom row with hover reveal (Vol left, mcap center, link right) */}
      <div className="mt-1 relative min-h-[44px] z-10">
        {/* default (not hovered): show ticker + description */}
        <div className="flex items-center gap-3 transition-opacity duration-200 opacity-100 group-hover:opacity-0">
          <span className="inline-block  px-2 py-0.5 text-xl text-white">${project.token.symbol.toUpperCase()}</span>
          <p className="text-green-300 text-md truncate flex-1">{project.oneliner}</p>
        </div>
        {/* hovered: show stats */}
        <div className="absolute inset-0 flex items-end justify-between gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
          <div className="pl-1 pointer-events-none">
            <div className="text-xs text-gray-300">Vol:</div>
            <div className="text-emerald-400 font-bold text-base">{formatCurrencyShort(volume)}</div>
            </div>
            <div className="text-center flex-1 pointer-events-none">
             <div className="text-xs text-gray-300">mcap:</div>
            <div className={`font-extrabold  ${change < 0 ? 'text-red-400' : change > 0 ? 'text-green-400' : 'text-gray-400'} text-lg`}>
              {formatCurrencyShort(marketcap)}{' '}
              <span className={` text-md ${change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400'}`}>{formatPercent(change)}</span>
            </div>
          </div>
          <div className="pr-1 pointer-events-auto">
            <a
              href={`https://pump.fun/coin/${project.token.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Open on pump.fun"
              className="inline-block"
            >
              <div className="relative w-10 h-10">
                <div className="absolute -inset-2 rounded-full bg-emerald-500/60 blur-xl opacity-0 group-hover:opacity-100 transition-opacity glow-pulse-green" />
                <Image
                  src="/pump.png"
                  alt="pump"
                  fill
                  className="object-contain relative z-10 hover-wiggle-bob"
                />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 z-10 relative">
        {/* <div className="h-1.5 bg-gray-800 rounded">
          <div className="h-1.5 bg-green-500 rounded" style={{ width: `${progress}%` }} />
        </div> */}
      </div>
    </div>
  );
}

export default FeaturedProjectCard;

