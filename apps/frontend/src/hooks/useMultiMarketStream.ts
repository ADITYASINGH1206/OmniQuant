import { useEffect, useState } from 'react';
import { getTickerConfig } from '../lib/tickerRegistry';
import type { Candle } from '../useMarketData';

export const useMultiMarketStream = (activeTicker: string, activeTimeframe: string = '1m') => {
  const [latestCandle, setLatestCandle] = useState<Candle | null>(null);
  
  useEffect(() => {
    // 1. Get routing configuration
    const config = getTickerConfig(activeTicker);
    let url = '';
    
    // 2. Conditional Routing Logic
    if (config.provider === 'binance') {
      url = `wss://stream.binance.com:9443/ws/${config.streamId}@kline_${activeTimeframe}`;
    } else if (config.provider === 'gateway') {
      url = `ws://localhost:3000/stream?symbol=${config.streamId}`;
    }

    // 3. Establish connection
    const socket = new WebSocket(url);
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Both Binance and our Mock Gateway use the standard Binance "kline" schema
        if (data.e === 'kline' && data.k) {
          const k = data.k;
          
          setLatestCandle({
            // Lightweight charts expects UNIX timestamp in seconds for intraday data
            time: Math.floor(k.t / 1000) as any, 
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
            value: parseFloat(k.v), // for volume histogram
          });
        }
      } catch (err) {
        console.error('[MultiMarketStream] Error parsing data:', err);
      }
    };

    socket.onerror = (error) => {
      console.error(`[MultiMarketStream] WebSocket Error for ${activeTicker}:`, error);
    };

    // 4. Strict Lifecycle Management: flush and close on unmount or deps change
    return () => {
      socket.close();
      setLatestCandle(null);
    };
  }, [activeTicker, activeTimeframe]);

  return { latestCandle };
};
