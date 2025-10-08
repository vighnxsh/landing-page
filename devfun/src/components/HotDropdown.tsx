'use client';

import { useState, useRef, useEffect } from 'react';
import { FiZap, FiChevronDown } from 'react-icons/fi';

interface HotDropdownProps {
  onChange?: (value: 'hot' | 'new') => void;
}

export default function HotDropdown({ onChange }: HotDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<'hot' | 'new'>('hot');
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const label = selected === 'hot' ? "what's hot" : "what's new";

  const select = (val: 'hot' | 'new') => {
    setSelected(val);
    setOpen(false);
    onChange?.(val);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex items-center space-x-2 bg-slate-400/20 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap"
      >
        <FiZap />
        <span>{label}</span>
        <FiChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-44 rounded-md border border-gray-700 bg-black shadow-lg z-20">
          <button
            type="button"
            className={`w-full text-left px-3 py-2 text-sm hover:bg-green-500/10 ${
              selected === 'hot' ? 'text-green-400' : 'text-gray-200'
            }`}
            onClick={() => select('hot')}
          >
            what&apos;s hot
          </button>
          <button
            type="button"
            className={`w-full text-left px-3 py-2 text-sm hover:bg-green-500/10 ${
              selected === 'new' ? 'text-green-400' : 'text-gray-200'
            }`}
            onClick={() => select('new')}
          >
            what&apos;s new
          </button>
        </div>
      )}
    </div>
  );
}


