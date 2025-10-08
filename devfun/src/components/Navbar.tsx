"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import BuildModal from './BuildModal';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  app: string;
  type: 'created' | 'forked' | 'commit';
}

export const Navbar: React.FC = () => {
  // Generate a larger activity list on mount
  const generateActivities = (): ActivityItem[] => {
    const users = ['8sP...bZN','Ayg...xXj','G25...t4M','6up...vnw','9dg...pnp','czb...vty','m1n...abc','q5x...qfk','j2l...r9p','k7e...0mn'];
    const apps = ['cohort','PaceTerminal','Duel Bank','dop edash','fantard.io','sombrepup','meowledge','pumpaholic','solpulse','void.exe'];
    const types: ActivityItem['type'][] = ['created','forked','commit'];
    const items: ActivityItem[] = [];
    for (let i = 0; i < 60; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      items.push({
        id: `${Date.now()}-${i}`,
        user: users[Math.floor(Math.random() * users.length)],
        action: type === 'commit' ? 'commit to' : type,
        app: apps[Math.floor(Math.random() * apps.length)],
        type,
      });
    }
    return items;
  };

  const [activities] = useState<ActivityItem[]>(generateActivities());
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isBuildOpen, setIsBuildOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % activities.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [activities.length, isMounted]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return '◇';
      case 'forked':
        return '↗';
      case 'commit':
        return '{}';
      default:
        return '◇';
    }
  };

  // Show multiple items at once
  const visibleCount = 5;
  const visibleItems = Array.from({ length: visibleCount }).map((_, i) => activities[(currentActivityIndex + i) % activities.length]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
      <div className="w-full px-3">
        {/* Top Activity Bar (multiple items, faster flicker) */}
        <div className="flex items-center justify-between pt-1 text-sm border-b border-black overflow-hidden">
          <div className="flex items-center space-x-4 overflow-hidden">
            <span className="text-white font-medium text-sm shrink-0">26,784 apps</span>
            <div className="flex items-center space-x-4 flex-nowrap whitespace-nowrap overflow-hidden" suppressHydrationWarning>
              {isMounted && visibleItems.map((activity, idx) => (
                <div key={`${activity.id}-${idx}`} className="flex items-center space-x-1 text-xs shrink-0">
                  <span className="text-green-400 flicker-fast text-sm">{getActivityIcon(activity.type)}</span>
                  <span className="text-white/90">({activity.user}) {activity.action} {activity.app}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Navigation - All on one line */}
        <div className="flex items-center justify-between py-2 pb-4">
          <div className="flex items-center space-x-6">
            {/* dev.fun Logo and Name */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="dev.fun logo"
                  fill
                  sizes="32px"
                  className="object-contain rounded-sm"
                  priority
                />
              </div>
              <span className="text-3xl font-black tracking-[-0.03em] text-white">dev.fun</span>
            </div>
            {/* how it works */}
            <a href="#" className="text-white hover:text-green-400 transition-colors text-base font-semibold tracking-tight">
              [how it works]
            </a>
            {/* bounties */}
            <a href="#" className="text-yellow-300/90 hover:text-yellow-400 transition-colors text-base font-semibold tracking-tight">
              [bounties] 💰
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              className="bg-green-400   text-black font-extrabold text-base px-3 mr-10 py-2  flex items-center space-x-2"
              onClick={() => setIsBuildOpen(true)}
            >
              <Image src="/pump.png" alt="plus" width={20} height={20} />
              <span className="font-extrabold text-md text-black">Build app</span>
            </Button>
            <Button 
              className="bg-green-400 text-black font-extrabold  px-4 py-2 "
            >
              <span className="font-extrabold text-md text-black">login</span>
            </Button>
          </div>
        </div>
      </div>
      <BuildModal isOpen={isBuildOpen} onClose={() => setIsBuildOpen(false)} onLogin={() => {}} />
    </nav>
  );
};
