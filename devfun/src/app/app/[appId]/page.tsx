'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DevFunApiService } from '@/services/devfunApi';
import { DevFunAppDetail, DevFunCommitItem, DevFunExtensionItem } from '@/types/devfun';
import Image from 'next/image';
import Link from 'next/link';

export default function AppPage() {
  const params = useParams();
  const appId = params.appId as string;
  
  const [app, setApp] = useState<DevFunAppDetail | null>(null);
  const [commits, setCommits] = useState<DevFunCommitItem[]>([]);
  const [extensions, setExtensions] = useState<DevFunExtensionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [detail, commitList, extensionList] = await Promise.all([
          DevFunApiService.fetchAppById(appId),
          DevFunApiService.fetchAppCommits(appId),
          DevFunApiService.fetchAppExtensions(appId),
        ]);
        setApp(detail);
        setCommits(commitList);
        setExtensions(extensionList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch app');
      } finally {
        setIsLoading(false);
      }
    };

    if (appId) {
      fetchAll();
    }
  }, [appId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading app...</div>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-red-400 text-xl font-medium mb-4">App Not Found</div>
          <div className="text-gray-400 mb-6">{error || 'The app you are looking for does not exist.'}</div>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to Apps
        </Link>

        {/* App Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Cover Image */}
          <div className="relative h-96 rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
            <Image
              src={app.cover}
              alt={app.name}
              fill
              className="object-cover"
            />
          </div>

          {/* App Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold mb-4 text-white">{app.name}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{app.description}</p>
            </div>

            {/* Tags and Category */}
            <div className="flex flex-wrap gap-2">
              {app.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-black/60 border border-gray-800 text-gray-300 px-3 py-1 rounded-none text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Token Info */}
            {app.token ? (
              <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-none p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={app.token.image}
                      alt={app.token.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{app.token.symbol}</div>
                    <div className="text-gray-400">{app.token.name}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Market Cap</div>
                    <div className="text-white font-medium text-lg">
                      ${app.token.marketcap.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">24h Change</div>
                    <div className={`font-medium text-lg ${
                      app.token.priceChangeIn24h > 0 ? 'text-green-400' : 
                      app.token.priceChangeIn24h < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {app.token.priceChangeIn24h > 0 ? '+' : ''}{app.token.priceChangeIn24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-green-400 hover:bg-green-500 text-black py-3 px-6 font-extrabold rounded-none transition-colors">
                Launch App
              </button>
              {app.token?.website && (
                <a
                  href={app.token.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/60 border border-gray-800 hover:border-gray-600 text-gray-200 py-3 px-6 rounded-none font-medium transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-none p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">{app.runsCount.toLocaleString()}</div>
            <div className="text-gray-400">Total Runs</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-none p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">{app.likeCount}</div>
            <div className="text-gray-400">Likes</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-none p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">{app.forkCount}</div>
            <div className="text-gray-400">Forks</div>
          </div>
          <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-none p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">{app.commitCount}</div>
            <div className="text-gray-400">Commits</div>
          </div>
        </div>

        {/* Commits */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4">Recent Commits</h3>
          {commits.length === 0 ? (
            <div className="text-gray-500">No commits yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {commits.map((c) => (
                <div key={c.id} className="bg-black/60 border border-gray-800 rounded-none overflow-hidden">
                  <div className="relative h-40">
                    <Image src={c.snapshot} alt={c.prompt} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Extensions */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4">Extensions</h3>
          {extensions.length === 0 ? (
            <div className="text-gray-500">No extensions.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extensions.map((ext) => (
                <div key={ext.id} className="bg-black/60 border border-gray-800 rounded-none p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-white font-medium">{ext.title}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${ext.status === 'in-use' ? 'bg-green-600/20 text-green-400' : ext.status === 'enabled' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-600/20 text-gray-400'}`}>
                      {ext.status}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">{ext.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Creator Info */}
        <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-none p-6">
          <h3 className="text-xl font-bold mb-4">Created by</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              {app.user.avatar ? (
                <Image
                  src={app.user.avatar}
                  alt={app.user.displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-lg text-gray-300">
                    {app.user.displayName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="text-white font-medium text-lg">{app.user.displayName}</div>
              <div className="text-gray-400">
                Created on {new Date(app.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

