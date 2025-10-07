"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';

type TokenChartEmbedProps = {
  contractAddress: string;
  height?: number;
  className?: string;
};

// lightweight TradingView embed using static.jup.ag library
const TRADING_VIEW_DOMAIN = 'https://static.jup.ag';
const TV_SCRIPT_ID = 'tv-lite-widget-script';

type TradingView = {
  widget: any;
};

declare global {
  interface Window {
    TradingView: TradingView;
  }
}

async function ensureTv(): Promise<TradingView> {
  if (typeof window === 'undefined') throw new Error('no-window');
  if (window.TradingView) return window.TradingView;
  const existing = document.getElementById(TV_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    await new Promise<void>((res) => existing.addEventListener('load', () => res(), { once: true }));
    return window.TradingView;
  }
  await new Promise<void>((res) => {
    const s = document.createElement('script');
    s.id = TV_SCRIPT_ID;
    s.src = `${TRADING_VIEW_DOMAIN}/tv/charting_library/charting_library.js`;
    s.onload = () => res();
    document.head.appendChild(s);
  });
  return window.TradingView;
}

export default function TokenChartEmbed({ contractAddress, height = 420, className = '' }: TokenChartEmbedProps) {
  const id = useMemo(() => `tv-${contractAddress}-container`, [contractAddress]);
  const widgetRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let destroyed = false;
    ensureTv()
      .then((tv) => {
        if (destroyed) return;
        const SUPPORTED_RESOLUTIONS = ['1','5','15','60','240','1D'];
        const mapResolution = (r: string) => {
          switch (r) {
            case '1': return '1m';
            case '5': return '5m';
            case '15': return '15m';
            case '60': return '1h';
            case '240': return '4h';
            default: return '1d';
          }
        };

        const datafeed = {
          onReady: (cb: any) => setTimeout(() => cb({ supported_resolutions: SUPPORTED_RESOLUTIONS, supports_marks: false, exchanges: [] })),
          searchSymbols: async () => {},
          resolveSymbol: async (_symbol: string, onResolved: any) => {
            const symbol = contractAddress;
            onResolved({
              name: symbol,
              ticker: symbol,
              description: symbol,
              type: 'crypto',
              session: '24x7',
              timezone: 'Etc/UTC',
              minmov: 1,
              pricescale: 10 ** 9,
              has_no_volume: true,
              has_intraday: true,
              supported_resolutions: SUPPORTED_RESOLUTIONS,
              data_status: 'streaming',
              exchange: 'jup.ag',
              listed_exchange: '',
              volume_precision: 2,
              format: 'price',
            });
          },
          getBars: async (_symbolInfo: any, resolution: string, periodParams: any, onHistory: any, onError: any) => {
            try {
              const interval = mapResolution(resolution);
              const from = Math.max(0, periodParams.from) * 1000;
              const to = periodParams.to * 1000;
              const candles = periodParams.countBack ?? 300;
              const url = `https://datapi.jup.ag/v2/charts/${contractAddress}?interval=${interval}&from=${from}&to=${to}&candles=${candles}&type=price`;
              const res = await fetch(url);
              if (!res.ok) throw new Error(String(res.status));
              const json = await res.json();
              const bars = (json.candles || []).map((c: any) => ({
                time: c.time * 1000,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
                volume: c.volume,
              }));
              onHistory(bars, { noData: bars.length === 0 });
            } catch (e: any) {
              onError(String(e));
            }
          },
          subscribeBars: () => {},
          unsubscribeBars: () => {},
        };

        const w = new tv.widget({
          symbol: contractAddress,
          interval: '15',
          container: id,
          theme: 'light',
          autosize: true,
          library_path: `${TRADING_VIEW_DOMAIN}/tv/charting_library/bundles`,
          custom_css_url: `${TRADING_VIEW_DOMAIN}/tv/css/tokenchart.css`,
          disabled_features: ['header_symbol_search','header_compare','timeframes_toolbar','header_undo_redo','display_market_status'],
          enabled_features: ['header_in_fullscreen_mode','side_toolbar_in_fullscreen_mode'],
          datafeed,
          overrides: {
            'paneProperties.backgroundType': 'solid',
            'paneProperties.background': '#0a0a0a',
            'scalesProperties.fontColor': '#a3a3a3',
          },
        });
        widgetRef.current = w;
        setReady(true);
      })
      .catch(() => setReady(false));
    return () => {
      destroyed = true;
      try { widgetRef.current?.remove?.(); } catch {}
      widgetRef.current = null;
    };
  }, [id, contractAddress]);

  if (!contractAddress) return null;

  return (
    <div className={`w-full bg-black/60 border border-gray-800 ${className}`} style={{ height }}>
      <div id={id} className="w-full h-full" />
      {!ready ? <div className="w-full h-full flex items-center justify-center text-gray-400">loading chart…</div> : null}
    </div>
  );
}


