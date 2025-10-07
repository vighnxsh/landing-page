'use client';

import { DevFunProject } from '@/types/devfun';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: DevFunProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
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

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 hover:scale-105 group cursor-pointer"
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
      {/* Project Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Project Name and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-2">
            {project.oneliner}
          </p>
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Token Info */}
        {project.token ? (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={project.token.image}
                  alt={project.token.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-white font-medium">{project.token.symbol}</div>
                <div className="text-gray-400 text-xs">{project.token.name}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-400 text-xs">Market Cap</div>
                <div className="text-white font-medium">
                  {formatMarketCap(project.token.marketcap)}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">24h Change</div>
                <div className={`font-medium ${getPriceChangeColor(project.token.priceChangeIn24h)}`}>
                  {formatPriceChange(project.token.priceChangeIn24h)}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm mb-4">
          <div>
            <div className="text-gray-400">Runs</div>
            <div className="text-white font-medium">{project.runsCount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-400">Likes</div>
            <div className="text-white font-medium">{project.likesCount}</div>
          </div>
          <div>
            <div className="text-gray-400">Apps</div>
            <div className="text-white font-medium">{project.appCount}</div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            {project.user.avatar ? (
              <Image
                src={project.user.avatar}
                alt={project.user.displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-gray-300">
                  {project.user.displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="text-white text-sm font-medium">
              {project.user.displayName}
            </div>
            <div className="text-gray-400 text-xs">
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/project/${project.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Project
          </Link>
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
