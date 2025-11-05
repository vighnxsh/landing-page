"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { authenticated } = usePrivy();

  return (
    <div
      className="flex flex-col items-center justify-center gap-12"
      style={{ height: "calc(100vh - var(--navbar-height))" }}
    >
      <h1 className="text-red-500 text-5xl sm:text-6xl  tracking-tight">
        trenches.lol
      </h1>

      {/* {authenticated ? (
        <Link
          href="/game"
          className="group relative grid place-items-center rounded-full text-white font-extrabold tracking-widest select-none"
          style={{ width: 280, height: 280 }}
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600 via-fuchsia-500 to-purple-600 opacity-90 blur-md transition group-hover:blur-lg"></span>
          <span className="absolute inset-0 rounded-full ring-2 ring-white/30 animate-ping"></span>
          <span className="relative z-10 rounded-full bg-black/50 backdrop-blur-sm w-full h-full grid place-items-center text-4xl sm:text-5xl shadow-[0_0_60px_rgba(255,0,0,0.35)] group-active:scale-95 transition-transform">
            PLAY
          </span>
        </Link>
      ) : (
        <p className="text-white/70">Log in to start playing.</p>
      )} */}
    </div>
  );
}
