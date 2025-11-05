"use client";

import React, { useEffect, useRef } from "react";

export default function PhaserGame() {
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<any | null>(null);

 
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (!containerRef.current || gameRef.current) return;

      // Dynamically import on client to avoid SSR issues with 'window'
      const [{ default: PhaserNS }, { config: baseConfig }] = await Promise.all([
        import("phaser"),
        import("../../../settings/config.js")
      ]);

      if (cancelled) return;

      const cfg = baseConfig as any;
      const config = {
        ...cfg,
        parent: containerRef.current as HTMLElement,
        scale: {
          ...(cfg?.scale || {}),
          parent: undefined
        }
      } as any;

      try {
        gameRef.current = new PhaserNS.Game(config);
      } catch (err) {
        console.error("Failed to initialize Phaser:", err);
      }
    };

    start();

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="game-container"
    />
 
  );
}
