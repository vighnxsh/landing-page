'use client';

// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { createChart, LineSeries, AreaSeries, type IChartApi } from 'lightweight-charts';

interface LineDataPoint {
  time: number;
  value: number;
}

type ChartDataItem =
  | { timestamp: number; price: string }
  | { time: number; open: number; high: number; low: number; close: number; volume?: number };

interface TokenChartProps {
  tokenAddress: string;
  interval?: '15_MINUTE' | '1_HOUR' | '4_HOUR' | '1_DAY';
  days?: number;
  tokenMetrics?: {
    symbol?: string;
    marketcap?: number;
    volumeIn24h?: number;
    priceChangeIn24h?: number;
  };
}

export function TokenChart({ 
  tokenAddress, 
  interval = '15_MINUTE', 
  days = 1,
  tokenMetrics
}: TokenChartProps) {
  const [data, setData] = useState<LineDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingProgress, setFetchingProgress] = useState(0);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<unknown>(null);
  const areaSeriesRef = useRef<unknown>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Start with recent data and then fetch historical data in chunks
        const to = Date.now();
        const from = to - (days * 24 * 60 * 60 * 1000);
        
        // First, fetch recent data (last 24 hours)
        const recentResponse = await fetch(
          `https://datapi.jup.ag/v2/charts/${tokenAddress}?interval=${interval}&baseAsset=${tokenAddress}&from=${to - (24 * 60 * 60 * 1000)}&to=${to}&candles=1000&type=price`
        );

        if (!recentResponse.ok) {
          throw new Error(`Failed to fetch chart data: ${recentResponse.status}`);
        }

        const recentData = await recentResponse.json();
        const recentArray = Array.isArray(recentData)
          ? recentData
          : (Array.isArray(recentData?.candles)
              ? recentData.candles
              : (Array.isArray(recentData?.data) ? recentData.data : []));
        setFetchingProgress(50);

        // Fetch historical data if needed (for days > 1)
        let historicalData: ChartDataItem[] = [];
        if (days > 1) {
          const historicalResponse = await fetch(
            `https://datapi.jup.ag/v2/charts/${tokenAddress}?interval=${interval}&baseAsset=${tokenAddress}&from=${from}&to=${to - (24 * 60 * 60 * 1000)}&candles=1000&type=price`
          );
          
          if (historicalResponse.ok) {
            const historicalJson = await historicalResponse.json();
            historicalData = Array.isArray(historicalJson)
              ? historicalJson
              : (Array.isArray(historicalJson?.candles)
                  ? historicalJson.candles
                  : (Array.isArray(historicalJson?.data) ? historicalJson.data : []));
          }
        }

        setFetchingProgress(100);

        // Combine and process data (ensure arrays before spreading)
        const safeHistorical = Array.isArray(historicalData) ? historicalData : [];
        const safeRecent = Array.isArray(recentArray) ? recentArray : [];
        const allData = [...safeHistorical, ...safeRecent];
        
        const processedData: LineDataPoint[] = allData
          .map((item: ChartDataItem) => {
            if ('time' in item && 'close' in item) {
              // Jupiter candles format uses seconds already
              return { time: item.time, value: item.close };
            }
            if ('timestamp' in item && 'price' in item) {
              return { time: item.timestamp / 1000, value: parseFloat(item.price) };
            }
            return { time: NaN, value: NaN } as LineDataPoint;
          })
          .filter(d => Number.isFinite(d.time) && Number.isFinite(d.value) && d.value > 0)
          .sort((a, b) => a.time - b.time)
          // Deduplicate by time, keeping the latest entry
          .reduce((acc: LineDataPoint[], curr) => {
            const existingIndex = acc.findIndex(item => item.time === curr.time);
            if (existingIndex >= 0) {
              acc[existingIndex] = curr; // Replace with newer data
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);

        setData(processedData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [tokenAddress, interval, days]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch {
        // Chart might already be disposed, ignore error
      }
      chartRef.current = null;
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      width: 600, // Fixed width instead of full container width
      height: 300,
      layout: {
        background: { color: '#000000' },
        textColor: '#FFFFFF',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#10B981',
          width: 1,
          labelBackgroundColor: '#10B981',
        },
        horzLine: {
          color: '#10B981',
          width: 1,
          labelBackgroundColor: '#10B981',
        },
      },
      rightPriceScale: {
        borderColor: '#1A1A1A',
        textColor: '#FFFFFF',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        entireTextOnly: false,
      },
      timeScale: {
        borderColor: '#1A1A1A',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    // Determine gradient color based on price trend
    const isPositive = data.length > 1 ? data[data.length - 1].value >= data[0].value : true;
    const gradientColor = isPositive ? '#10B981' : '#EF4444';
    const topColor = isPositive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)';
    const bottomColor = isPositive ? 'rgba(16, 185, 129, 0.00)' : 'rgba(239, 68, 68, 0.00)';

    // Add area series for gradient background
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: gradientColor,
      topColor,
      bottomColor,
      lineWidth: 1, // Minimal line width
      priceLineVisible: false,
      lastValueVisible: false,
    });

    // Add line series on top
    const lineSeries = chart.addSeries(LineSeries, {
      color: gradientColor,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    seriesRef.current = lineSeries;
    areaSeriesRef.current = areaSeries;
    chartRef.current = chart;

    // Add crosshair move listener to show price
    chart.subscribeCrosshairMove((param) => {
      if (param.point === undefined || !param.time) {
        setCurrentPrice(null);
        return;
      }
      
      const data = param.seriesData.get(lineSeries);
      if (data && typeof data === 'object' && 'value' in data) {
        setCurrentPrice(data.value as number);
      } else if (typeof data === 'number') {
        setCurrentPrice(data);
      } else {
        setCurrentPrice(null);
      }
    });

    // If data is already loaded, render it now (prevents race condition)
    if (data.length > 0) {
      try {
        const chartData = data.map(item => ({ time: item.time as unknown as number, value: item.value }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (seriesRef.current as { setData: (d: any[]) => void }).setData(chartData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (areaSeriesRef.current as { setData: (d: any[]) => void }).setData(chartData);
        chartRef.current.timeScale().fitContent();
      } catch (e) {
        console.error('Failed to set initial chart data:', e);
      }
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: 600, // Keep fixed width on resize
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch {
          // Chart might already be disposed, ignore error
        }
        chartRef.current = null;
      }
    };
  }, [tokenMetrics, data]);

  // Update chart data when data changes
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      // Convert data to the correct format for lightweight-charts
      const chartData = data.map(item => ({
        time: item.time as unknown as number, // Cast to the expected type
        value: item.value
      }));
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (seriesRef.current as { setData: (data: any[]) => void }).setData(chartData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (areaSeriesRef.current as { setData: (data: any[]) => void }).setData(chartData);
      
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data]);

  if (loading) {
    return (
      <div className="w-fit">
        <div className="w-[600px] h-[300px] bg-black rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-white text-sm">Loading chart data...</p>
            <div className="w-32 bg-gray-800 rounded-full h-1 mt-2">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-300" 
                style={{ width: `${fetchingProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-fit">
        <div className="w-[600px] h-[300px] bg-black rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-sm">Error loading chart</p>
            <p className="text-gray-400 text-xs mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-fit">
        <div className="w-[600px] h-[300px] bg-black rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-sm">No chart data available</p>
            <p className="text-gray-400 text-xs mt-1">Token: {tokenMetrics?.symbol || tokenAddress.slice(0, 8)}...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate market cap: 1 billion supply * current price
  const marketCap = currentPrice !== null ? (currentPrice * 1000000000) : null;

  return (
    <div className="w-fit">
      <div className="relative">
        {marketCap !== null && (
          <div className="absolute top-2 right-2 bg-green-500 text-black px-2 py-1 rounded text-sm font-bold z-10">
            ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        )}
        <div ref={chartContainerRef} className="w-[600px] h-[300px] bg-black rounded-lg" />
      </div>
    </div>
  );
}

export default TokenChart;
