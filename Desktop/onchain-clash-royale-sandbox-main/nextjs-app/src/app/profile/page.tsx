"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function ProfilePage() {
  const privy = usePrivy();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" style={{ minHeight: "calc(100vh - var(--navbar-height))" }}>
      <h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
      <pre className="whitespace-pre-wrap break-words rounded bg-black/50 p-4 text-white/90">
        {JSON.stringify(
          {
            ready: privy.ready,
            authenticated: privy.authenticated,
            user: privy.user
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}


