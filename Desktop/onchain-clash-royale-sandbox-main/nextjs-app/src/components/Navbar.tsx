"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function Navbar() {
  const { authenticated, login, logout, user } = usePrivy();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
      style={{
        height: "var(--navbar-height)",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)"
      }}
    >
      <div
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-4"
        style={{ height: "100%" }}
      >
        <Link href="/" className=" text-3xl text-red-500 ">
          trenches.lol
        </Link>
        <div className="flex items-center gap-4">
          {!authenticated ? (
            <button
              onClick={() => login()}
              className="rounded bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              Login
            </button>
          ) : (
            <>
              <Link href="/profile" className="text-white/80 hover:text-white text-sm">
                Profile
              </Link>
              <span className="text-white/70 text-xs hidden sm:inline">
                {user?.email?.address || user?.wallet?.address?.slice(0, 6) + "…" + user?.wallet?.address?.slice(-4) || "Signed in"}
              </span>
              <button
                onClick={() => logout()}
                className="rounded bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
              >
                Logout
              </button>
            </>
          )}
          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white text-sm"
          >
            X
          </a>
        </div>
      </div>
    </nav>
  );
}
 

