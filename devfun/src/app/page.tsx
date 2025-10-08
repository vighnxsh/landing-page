import FeaturedProjectsCarousel from '@/components/FeaturedProjectsCarousel';
import { AppsGrid } from '@/components/AppsGrid';
import { DevFunApiService } from '@/services/devfunApi';
import { FiCpu, FiTool, FiMessageSquare, FiDollarSign, FiSmile } from 'react-icons/fi';
import { FaGamepad } from 'react-icons/fa';
import HotDropdown from '@/components/HotDropdown';

export default async function Home() {
  let featuredProjects = [] as Awaited<ReturnType<typeof DevFunApiService.fetchFeaturedProjects>>;
  let apps = [] as Awaited<ReturnType<typeof DevFunApiService.fetchFeaturedApps>>;
  let errorApps: string | null = null;

  try {
    featuredProjects = await DevFunApiService.fetchFeaturedProjects();
  } catch {
    // Error handled by empty array fallback
  }

  try {
    apps = await DevFunApiService.fetchFeaturedApps();
  } catch (err) {
    errorApps = err instanceof Error ? err.message : 'Failed to fetch apps';
  }
 
  return (
    <div className="min-h-screen">
      <main className="pt-36">
        <div className="max-w-7xl mx-auto px-4">
          {/* Featured Projects Section */}
          <div className="mb-6">
            <FeaturedProjectsCarousel projects={featuredProjects} />
          </div>

          {/* Tabs + Search */}
          <div className="mb-8">
            <div className="flex items-center gap-6 border-b border-gray-800 pb-4 mb-4 flex-wrap">
              <div className="flex items-center space-x-8">
                <button className="pb-1 border-b-2 border-green-500 text-white font-medium rounded-none">
                  apps
                </button>
                <button className="pb-1 text-gray-400 hover:text-white transition-colors rounded-none">
                  projects
                </button>
              </div>
              <div className="relative w-full sm:w-80 md:w-96">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="find the next 100x app..."
                  className="w-full pl-10 pr-4 py-2.5 bg-black text-gray-400   focus:border-green-500 transition-colors"
                />
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="flex items-center flex-wrap gap-4 pb-2">
              <HotDropdown />
              <button className="flex items-center space-x-2 text-gray-300 px-4 py-2 rounded-none transition-colors whitespace-nowrap hover:bg-green-400/20 hover:text-green-400">
                <FaGamepad />
                <span>gaming</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-300 px-4 py-2 rounded-none transition-colors whitespace-nowrap hover:bg-green-400/20 hover:text-green-400">
                <FiCpu />
                <span>ai</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-300 px-4 py-2 rounded-none transition-colors whitespace-nowrap hover:bg-green-400/20 hover:text-green-400">
                <FiTool />
                <span>utility</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-300 px-4 py-2 rounded-none transition-colors whitespace-nowrap hover:bg-green-400/20 hover:text-green-400">
                <FiMessageSquare />
                <span>social</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-300 px-4 py-2 rounded-none transition-colors whitespace-nowrap hover:bg-green-400/20 hover:text-green-400">
                <FiDollarSign />
                <span>money</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-300 px-4 py-2 rounded-none transition-colors whitespace-nowrap hover:bg-green-400/20 hover:text-green-400">
                <FiSmile />
                <span>fun</span>
              </button>
            </div>
          </div>

          {/* Apps Section */}
          <div className="mb-8">
            <AppsGrid apps={apps} isLoading={false} error={errorApps} />
          </div>
        </div>
      </main>
    </div>
  );
}
