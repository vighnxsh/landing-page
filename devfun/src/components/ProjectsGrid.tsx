'use client';

import { DevFunProject } from '@/types/devfun';
import { FeaturedProjectCard } from './FeaturedProjectCard';

interface ProjectsGridProps {
  projects: DevFunProject[];
  isLoading?: boolean;
  error?: string | null;
}

export function ProjectsGrid({ projects, isLoading, error }: ProjectsGridProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg font-medium mb-2">Error loading projects</div>
        <div className="text-gray-400">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-800"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-800 rounded mb-2"></div>
              <div className="h-4 bg-gray-800 rounded mb-4"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-4 bg-gray-800 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-800 rounded"></div>
                <div className="w-20 h-10 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg font-medium mb-2">No projects found</div>
        <div className="text-gray-500">Try adjusting your search or filters</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="w-full">
          <FeaturedProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
