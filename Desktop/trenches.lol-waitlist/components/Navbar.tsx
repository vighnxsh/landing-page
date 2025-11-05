"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

export default function Navbar() {
  const { authenticated, user } = usePrivy();
  const [showDrafted, setShowDrafted] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!authenticated) return;
      const walletAddress = user?.wallet?.address;
      const email = user?.email?.address;
      const username = user?.twitter?.username || user?.farcaster?.username || undefined;
      const xUsername = user?.twitter?.username || undefined;

      try {
        const res = await fetch("/api/auth/first-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress, email, username, xUsername })
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data && data.created && xUsername) {
          setShowDrafted(true);
        }
      } catch (e) {
        console.error("first-login call failed", e);
      }
    };
    run();
  }, [authenticated, user]);

  return (
    <nav
      className="fixed top-0 bg-[#0040FF] left-0 right-0 z-50 bitcount-grid-single-class"
      style={{
        height: "var(--navbar-height)",
        
      }}
    >
      <div
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-4"
        style={{ height: "100%" }}
      >
        <Link href="/" className="flex items-center" aria-label="Home">
          <Image src="/logo.png" alt="trenches.lol" width={100} height={18} priority />
        </Link>

        <div className="flex items-center gap-4">
          {/* Hidden: Profile/Game/Login/Logout */}
          <a
            href="https://x.com/trenches_pvp"
            target="_blank"
            rel="noreferrer"
            style={{ textShadow: "1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000" }}
                className=" pr-8 text-white underline hover:text-white text-3xl"
          >
            Follow on X
          </a>
        </div>
      </div>
      {showDrafted && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="rounded-md bg-white px-6 py-4 text-center shadow-lg">
            <p className="text-2xl font-semibold text-black">You're drafted!</p>
            <button
              onClick={() => setShowDrafted(false)}
              className="mt-4 rounded border border-black px-4 py-1 text-black hover:bg-black/10"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
 

