import { useState, useEffect } from 'react';

export interface Candle {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    value: number; // Volume
    color?: string; // Optional for volume
}

import { getTickerConfig } from './lib/tickerRegistry';

export const useMarketData = (activeTicker: string = 'BTC/USDT', activeTimeframe: string = '1m') => {
    const [data, setData] = useState<Candle[]>([]);

    useEffect(() => {
        const fetchOrGenerateData = async () => {
            const config = getTickerConfig(activeTicker);
            
            // Determine timeframe step in seconds
            let tfMultiplier = 60; // default 1m
            if (activeTimeframe === '5m') tfMultiplier = 300;
            else if (activeTimeframe === '15m') tfMultiplier = 900;
            else if (activeTimeframe === '1h') tfMultiplier = 3600;
            else if (activeTimeframe === '4h') tfMultiplier = 14400;
            else if (activeTimeframe === '1d') tfMultiplier = 86400;

            if (config.provider === 'binance') {
                try {
                    // Fetch real history from Binance REST API
                    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${config.streamId.toUpperCase()}&interval=${activeTimeframe}&limit=500`);
                    const json = await response.json();
                    
                    const historicalData: Candle[] = json.map((d: any) => ({
                        time: Math.floor(d[0] / 1000) as any,
                        open: parseFloat(d[1]),
                        high: parseFloat(d[2]),
                        low: parseFloat(d[3]),
                        close: parseFloat(d[4]),
                        value: parseFloat(d[5]),
                        color: parseFloat(d[4]) >= parseFloat(d[1]) ? '#26a69a' : '#ef5350'
                    }));
                    
                    setData(historicalData);
                } catch (error) {
                    console.error("Failed to fetch Binance history:", error);
                }
            } else {
                // Generate Mock Data for Gateway (Forex/Gold)
                const initialData: Candle[] = [];
                const rawNow = Math.floor(Date.now() / 1000);
                const now = rawNow - (rawNow % tfMultiplier); // Align to boundary!
                
                let currentPrice = 42000;
                if (activeTicker === 'ETH/USDT') currentPrice = 2200;
                else if (activeTicker === 'XAU/USD') currentPrice = 2000;
                else if (activeTicker === 'EUR/USD') currentPrice = 1.1;
                
                for (let i = 500; i >= 0; i--) {
                    const time = now - (i * tfMultiplier);
                    
                    const volatility = currentPrice * 0.002;
                    const open = currentPrice + (Math.random() - 0.5) * volatility;
                    const close = open + (Math.random() - 0.5) * volatility;
                    const high = Math.max(open, close) + Math.random() * (volatility / 2);
                    const low = Math.min(open, close) - Math.random() * (volatility / 2);
                    
                    const volume = Math.random() * 100;
                    const color = close >= open ? '#26a69a' : '#ef5350';
                    
                    initialData.push({ 
                        time: time as any, 
                        open, 
                        high, 
                        low, 
                        close, 
                        value: volume,
                        color 
                    });
                    currentPrice = close;
                }
                setData(initialData);
            }
        };
        
        fetchOrGenerateData();
    }, [activeTicker, activeTimeframe]);

    return data;
};
