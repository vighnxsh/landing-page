"use client";
import Image from "next/image";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { authenticated, login } = usePrivy();

  return (
    <div
      className="flex bg-[#0040FF]  flex-col items-center justify-center gap-12 bitcount-grid-single-class"
      style={{ height: "calc(100vh - var(--navbar-height))" }}
    >
    
      {/* <Link href="/game" className="flex items-center" aria-label="Home">
          <Image src="/logo.png" className="pt-10" alt="trenches.lol" width={400} height={120} priority />
        </Link> */}
        <Image
          src="/banner.png"
          alt="trenches.lol banner"
          width={480}
          height={165}
          priority
          className="h-auto w-[min(90vw,480px)]"
        />
       
        {authenticated ? (
          <div className="bg-white text-[#000000] px-4 py-2 border-2 border-black rounded-md cursor-default">
            <h1 className="text-2xl font-medium p-1">You're In !</h1>
          </div>
        ) : (
          <button
            onClick={() => login()}
            className="bg-white text-[#000000] px-4 py-2 border-2 border-black rounded-md"
          >
            <h1 className="text-2xl font-medium p-1">Get Drafted</h1>
          </button>
        )}
    </div>
  );
}
