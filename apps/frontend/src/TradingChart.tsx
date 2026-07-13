import React, { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, LineSeries, HistogramSeries, CrosshairMode } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import { useMarketData } from './useMarketData';
import type { Candle } from './useMarketData';

export const TradingChart: React.FC<{ activeTicker?: string, activeTimeframe?: string, latestCandle?: Candle | null }> = ({ activeTicker = 'BTC/USDT', activeTimeframe = '1m', latestCandle = null }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const data = useMarketData(activeTicker, activeTimeframe);
    
    // Indicator states
    const [showShortSMA, setShowShortSMA] = useState(false);
    const [showLongSMA, setShowLongSMA] = useState(false);
    
    // Live Legend State
    const [legendData, setLegendData] = useState<Candle | null>(null);
    
    // Series references
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const shortSmaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const longSmaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    // Calculate SMA helper
    const calculateSMA = (seriesData: Candle[], window: number) => {
        const sma = [];
        for (let i = 0; i < seriesData.length; i++) {
            if (i < window - 1) continue;
            let sum = 0;
            for (let j = 0; j < window; j++) {
                sum += seriesData[i - j].close;
            }
            sma.push({ time: seriesData[i].time, value: sum / window });
        }
        return sma;
    };

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;
        
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 600,
            layout: { 
                background: { type: 'solid', color: '#131722' }, 
                textColor: '#d1d4dc' 
            },
            grid: { 
                vertLines: { color: 'rgba(42, 46, 57, 0.5)' }, 
                horzLines: { color: 'rgba(42, 46, 57, 0.5)' } 
            },
            crosshair: { mode: CrosshairMode.Normal },
            rightPriceScale: { borderColor: '#2b2b43' },
            timeScale: { borderColor: '#2b2b43' }
        });
        
        // Candlestick setup
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'
        });

        // Volume setup (overlay)
        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: '', 
        });
        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });
        
        chartRef.current = chart;
        candlestickSeriesRef.current = candlestickSeries;
        volumeSeriesRef.current = volumeSeries;

        // Crosshair Hover Legend Sub
        chart.subscribeCrosshairMove((param) => {
            if (!param.time || param.point === undefined || param.point.x < 0 || param.point.y < 0) {
                // If out of bounds, you could reset it, but keeping the last hovered data is often nicer.
                // We'll reset it to show nothing for a clean look, or you could fallback to the last bar.
                setLegendData(null); 
            } else {
                const priceData = param.seriesData.get(candlestickSeries) as any;
                const volData = param.seriesData.get(volumeSeries) as any;
                if (priceData) {
                    setLegendData({
                        time: param.time as string,
                        open: priceData.open,
                        high: priceData.high,
                        low: priceData.low,
                        close: priceData.close,
                        value: volData?.value || 0,
                        color: ''
                    });
                }
            }
        });
        
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth || 800 });
        };
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Clear chart on ticker/timeframe change to prevent overlap
    useEffect(() => {
        if (candlestickSeriesRef.current && volumeSeriesRef.current) {
            candlestickSeriesRef.current.setData([]);
            volumeSeriesRef.current.setData([]);
            setLegendData(null);
        }
    }, [activeTicker, activeTimeframe]);

    // Set Initial Historical Data
    useEffect(() => {
        if (data.length > 0 && candlestickSeriesRef.current && volumeSeriesRef.current) {
            candlestickSeriesRef.current.setData(data as any);
            volumeSeriesRef.current.setData(data as any);
            setLegendData(data[data.length - 1]);
        }
    }, [data]);

    // Update with Live Ticks
    useEffect(() => {
        if (latestCandle && candlestickSeriesRef.current && volumeSeriesRef.current) {
            try {
                candlestickSeriesRef.current.update(latestCandle as any);
                volumeSeriesRef.current.update(latestCandle as any);
                setLegendData(latestCandle);
            } catch (err) {
                // Ignore update errors for out of order ticks
            }
        }
    }, [latestCandle]);

    // Handle Short SMA Toggle (10 Periods)
    useEffect(() => {
        if (!chartRef.current || data.length === 0) return;
        
        if (showShortSMA) {
            const shortData = calculateSMA(data, 10);
            if (!shortSmaSeriesRef.current) {
                shortSmaSeriesRef.current = chartRef.current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 2, title: 'SMA (10)' });
            }
            shortSmaSeriesRef.current.setData(shortData);
        } else if (shortSmaSeriesRef.current) {
            chartRef.current.removeSeries(shortSmaSeriesRef.current);
            shortSmaSeriesRef.current = null;
        }
    }, [showShortSMA, data]);

    // Handle Long SMA Toggle (30 Periods)
    useEffect(() => {
        if (!chartRef.current || data.length === 0) return;
        
        if (showLongSMA) {
            const longData = calculateSMA(data, 30);
            if (!longSmaSeriesRef.current) {
                longSmaSeriesRef.current = chartRef.current.addSeries(LineSeries, { color: '#FF6D00', lineWidth: 2, title: 'SMA (30)' });
            }
            longSmaSeriesRef.current.setData(longData);
        } else if (longSmaSeriesRef.current) {
            chartRef.current.removeSeries(longSmaSeriesRef.current);
            longSmaSeriesRef.current = null;
        }
    }, [showLongSMA, data]);

    const btnStyle = { padding: '8px 16px', marginRight: '10px', cursor: 'pointer', background: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' };
    const btnActiveStyle = { ...btnStyle, background: '#2962FF', borderColor: '#2962FF' };

    return (
        <div style={{ background: '#0e1015', borderRadius: '12px', border: '1px solid #2a2e39', overflow: 'hidden' }}>
            {/* Top Toolbar */}
            <div style={{ padding: '15px', background: '#131722', borderBottom: '1px solid #2a2e39', textAlign: 'left' }}>
                <button 
                    style={showShortSMA ? btnActiveStyle : btnStyle} 
                    onClick={() => setShowShortSMA(!showShortSMA)}
                >
                    Short SMA (10)
                </button>
                <button 
                    style={showLongSMA ? { ...btnActiveStyle, background: '#FF6D00', borderColor: '#FF6D00' } : btnStyle} 
                    onClick={() => setShowLongSMA(!showLongSMA)}
                >
                    Long SMA (30)
                </button>
            </div>

            {/* Chart Area wrapper relative for floating legend */}
            <div style={{ position: 'relative' }}>
                <div ref={chartContainerRef} style={{ width: '100%' }} />
                
                {/* Floating Legend HUD */}
                {legendData && (
                    <div style={{
                        position: 'absolute', top: '15px', left: '15px', zIndex: 10,
                        background: 'rgba(19, 23, 34, 0.75)', padding: '12px 15px',
                        borderRadius: '6px', fontSize: '13px', color: '#d1d4dc',
                        pointerEvents: 'none', border: '1px solid rgba(42, 46, 57, 0.8)', 
                        backdropFilter: 'blur(4px)', fontFamily: 'monospace'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: 'white', fontSize: '15px' }}>
                            BTC-USD <span style={{ color: '#888', fontSize: '12px', marginLeft: '10px' }}>{legendData.time}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <span><span style={{ color: '#888' }}>O</span> {legendData.open.toFixed(2)}</span>
                            <span><span style={{ color: '#888' }}>H</span> {legendData.high.toFixed(2)}</span>
                            <span><span style={{ color: '#888' }}>L</span> {legendData.low.toFixed(2)}</span>
                            <span><span style={{ color: '#888' }}>C</span> {legendData.close.toFixed(2)}</span>
                            <span><span style={{ color: '#888' }}>Vol</span> {legendData.value.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
