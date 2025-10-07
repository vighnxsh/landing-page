"use client";

import React from 'react';
import { createPortal } from 'react-dom';

type BuildModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
};

export default function BuildModal({ isOpen, onClose, onLogin }: BuildModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-green-500/35 via-black/70 to-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* content */}
      <div className="relative w-full max-w-3xl">
        <div className="">
          {/* header */}
          <div className="flex items-center justify-between px-6 pt-6">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                build something onchain
              </h2>
              <p className="text-gray-300 mt-2">
                turn ideas into apps people <span className="text-green-400">use</span> .
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-400 hover:text-white transition-colors text-2xl px-2"
            >
              ×
            </button>
          </div>

          {/* input area */}
          <div className="px-6 pt-8">
            <div className="bg-[#111] border border-gray-800">
              <textarea
                placeholder="build a pump prediction game..."
                rows={4}
                className="w-full resize-none bg-transparent p-4 text-gray-300 outline-none"
              />
              <div className="flex items-center justify-between bg-black/60 px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  {['rentdue raccoon fund','ai solana mascot','meme market predictor'].map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1 text-sm bg-[#0b0b0b] border border-gray-800 text-gray-300 hover:text-green-400 hover:border-green-600 transition-colors cursor-default"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <button
                  onClick={onLogin}
                  className="bg-green-400 text-black font-extrabold px-4 py-2 flex items-center gap-2"
                >
                  <span>login to build</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-black text-green-400">+</span>
                </button>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>,
    document.body
  );
}


