'use client';

import { useState, useMemo } from 'react';
import { DevFunProject } from '@/types/devfun';
import FeaturedProjectCard from './FeaturedProjectCard';

interface FeaturedProjectsCarouselProps {
  projects: DevFunProject[];
}

export function FeaturedProjectsCarousel({ projects }: FeaturedProjectsCarouselProps) {
  const pageSize = 3;
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);
  const visible = useMemo(
    () => projects.slice(clampedPage * pageSize, clampedPage * pageSize + pageSize),
    [projects, clampedPage]
  );

  const canPrev = clampedPage > 0;
  const canNext = clampedPage < totalPages - 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl pl-2 font-bold text-green-200 flex items-center gap-2">
            Featured projects
            <svg xmlns="http://www.w3.org/2000/svg" className="inline w-6 h-6 text-yellow-400" fill="yellow" viewBox="0 0 24 24">
              <path d="M2 7l5 7 5-9 5 9 5-7-2 13H4L2 7zm2.24 11h15.52l1.26-8.18-3.47 4.85-4.55-8.19-4.55 8.19-3.47-4.85L4.24 18z"/>
            </svg>
          </h2>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className={`p-1 rounded ${canPrev ? 'hover:bg-gray-800' : 'opacity-40 cursor-not-allowed'}`}
              onClick={() => canPrev && setPage((p) => Math.max(0, p - 1))}
              aria-label="Previous"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className={`p-1 rounded ${canNext ? 'hover:bg-gray-800' : 'opacity-40 cursor-not-allowed'}`}
              onClick={() => canNext && setPage((p) => Math.min(totalPages - 1, p + 1))}
              aria-label="Next"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((project) => (
          <div key={project.id} className="w-full">
            <FeaturedProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProjectsCarousel;


