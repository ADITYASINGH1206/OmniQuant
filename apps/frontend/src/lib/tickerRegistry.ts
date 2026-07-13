export type AssetClass = 'Crypto' | 'Forex' | 'Commodity';
export type Provider = 'binance' | 'gateway';

export interface TickerConfig {
    symbol: string;         // UI readable symbol, e.g., "BTC/USDT"
    assetClass: AssetClass; // "Crypto", "Forex", etc.
    provider: Provider;     // "binance" | "gateway"
    streamId: string;       // Exchange specific ID, e.g., "btcusdt" or "GC=F"
}

export const TICKER_REGISTRY: Record<string, TickerConfig> = {
    'BTC/USDT': {
        symbol: 'BTC/USDT',
        assetClass: 'Crypto',
        provider: 'binance',
        streamId: 'btcusdt'
    },
    'ETH/USDT': {
        symbol: 'ETH/USDT',
        assetClass: 'Crypto',
        provider: 'binance',
        streamId: 'ethusdt'
    },
    'XAU/USD': {
        symbol: 'XAU/USD',
        assetClass: 'Commodity',
        provider: 'gateway',
        streamId: 'GC=F'
    },
    'EUR/USD': {
        symbol: 'EUR/USD',
        assetClass: 'Forex',
        provider: 'gateway',
        streamId: 'EURUSD=X'
    },
    'GBP/USD': {
        symbol: 'GBP/USD',
        assetClass: 'Forex',
        provider: 'gateway',
        streamId: 'GBPUSD=X'
    }
};

export const getTickerConfig = (symbol: string): TickerConfig => {
    return TICKER_REGISTRY[symbol] || TICKER_REGISTRY['BTC/USDT'];
};
