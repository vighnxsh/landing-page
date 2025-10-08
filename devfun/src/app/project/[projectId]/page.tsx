'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DevFunApiService } from '@/services/devfunApi';
import { DevFunProjectDetail } from '@/types/devfun';
import Image from 'next/image';
import Link from 'next/link';
import { TokenChart } from '@/components/TokenChart';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<DevFunProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await DevFunApiService.fetchProjectById(projectId);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl font-medium mb-4">Project Not Found</div>
          <div className="text-gray-400 mb-6">{error || 'The project you are looking for does not exist.'}</div>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back
        </Link>

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-8 mb-10 pt-16">
          <div className="relative w-40 h-40 rounded-none overflow-hidden border border-gray-800 bg-black/60">
            <Image src={project.image} alt={project.name} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold mb-2">{project.name}</h1>
          
            <div className="text-gray-300 leading-relaxed">{project.description}</div>
            <div className="mt-5 flex gap-3">
              {project.website && (
                <a href={project.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-500 text-black px-4 py-2 font-extrabold rounded-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 7 7l-3 3a5 5 0 0 1-7-7l1-1"/><path d="M14 11a5 5 0 0 0-7-7L4 7a5 5 0 0 0 7 7l1-1"/></svg>
                  Website
                </a>
              )}
              {project.twitter && (
                <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/60 border border-gray-800 hover:border-gray-600 text-gray-200 px-4 py-2 rounded-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.35 8.46 8.46 0 0 1-2.7 1.03A4.24 4.24 0 0 0 12 8.24c0 .33.04.66.1.97A12.06 12.06 0 0 1 3 5.16a4.25 4.25 0 0 0 1.31 5.66 4.2 4.2 0 0 1-1.92-.53v.05a4.24 4.24 0 0 0 3.4 4.16c-.46.12-.95.18-1.44.07a4.25 4.25 0 0 0 3.96 2.95A8.5 8.5 0 0 1 2 19.55a12 12 0 0 0 6.5 1.9c7.8 0 12.08-6.46 12.08-12.07 0-.18 0-.35-.01-.53A8.6 8.6 0 0 0 24 6.6a8.4 8.4 0 0 1-2.4.66 4.23 4.23 0 0 0 1.86-2.33z"/></svg>
                  Twitter
                </a>
              )}
              {project.telegram && (
                <a href={project.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/60 border border-gray-800 hover:border-gray-600 text-gray-200 px-4 py-2 rounded-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.04 15.3l-.38 5.34c.54 0 .77-.23 1.05-.5l2.52-2.42 5.22 3.83c.96.53 1.65.25 1.91-.88l3.46-16.22h.01c.31-1.45-.52-2.02-1.46-1.67L1.2 9.72C-.22 10.27-.2 11.1.96 11.44l5.4 1.68 12.56-7.92c.59-.38 1.12-.17.68.21"/></svg>
                  Telegram
                </a>
              )}
            </div>
          </div>
        </div>
        {project.token && (
          <div className="mb-12">
           
            <TokenChart 
              tokenAddress={project.token.contractAddress}
              interval="15_MINUTE"
              days={7}
              tokenMetrics={{
                symbol: project.token.symbol,
                marketcap: project.token.marketcap,
                volumeIn24h: project.token.volumeIn24h,
                priceChangeIn24h: project.token.priceChangeIn24h
              }}
            />
          </div>
        )}


        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/60 border border-gray-800 rounded-none p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 text-gray-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"/><path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/></svg>
                <span>token</span>
              </div>
              {project.token && (
                <span className="px-2 py-1 rounded bg-gray-800 text-white text-xs">${project.token.symbol}</span>
              )}
            </div>
            {project.token ? (
              <>
                <div className="text-sm text-gray-400 mb-1">market cap</div>
                <div className="text-2xl font-bold">${project.token.marketcap.toLocaleString()}</div>
                <div className="mt-4 text-sm text-gray-400 mb-1">volume (24h)</div>
                <div className="text-2xl font-bold">${project.token.volumeIn24h.toLocaleString()}</div>
                <div className="mt-4 text-sm text-gray-400 mb-1">24h change</div>
                <div className={`text-xl font-semibold ${project.token.priceChangeIn24h > 0 ? 'text-green-400' : project.token.priceChangeIn24h < 0 ? 'text-red-400' : 'text-gray-400'}`}>{project.token.priceChangeIn24h > 0 ? '+' : ''}{project.token.priceChangeIn24h.toFixed(2)}%</div>
              </>
            ) : (
              <div className="text-gray-500">No token data</div>
            )}
                  </div>

              <div className="bg-black/60 border border-gray-800 rounded-none p-6">
            <div className="inline-flex items-center gap-2 text-gray-300 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>users</span>
                  </div>
            <div className="text-3xl font-bold">{project.runsCount.toLocaleString()}</div>
                  </div>

          <div className="bg-black/60 border border-gray-800 rounded-none p-6">
            <div className="inline-flex items-center gap-2 text-gray-300 mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
              <span>likes</span>
            </div>
            <div className="text-3xl font-bold">{project.likesCount.toLocaleString()}</div>
          </div>
        </div>

        {/* Price Chart */}
     

        {/* Additional Stats */}
     
      </div>
    </div>
  );
}

