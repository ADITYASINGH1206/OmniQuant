import React, { useState } from 'react';
import axios from 'axios';

interface PaperTradingProps {
  onOrderSuccess: () => void;
  activeTicker: string;
}

export const PaperTrading: React.FC<PaperTradingProps> = ({ onOrderSuccess, activeTicker }) => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
  const [price, setPrice] = useState<string>('42912.44');
  const [quantity, setQuantity] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const executeOrder = async () => {
    setError('');
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/paper/order', {
        action: side,
        symbol: activeTicker,
        quantity: qty,
        price: parseFloat(price)
      });
      setQuantity('');
      onOrderSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const cost = (parseFloat(quantity || '0') * parseFloat(price || '0')).toFixed(2);
  const fees = (parseFloat(cost) * 0.0002).toFixed(2); // 0.02% fees

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto custom-scrollbar">
      {/* Dual BUY/SELL Tabs */}
      <div className="flex h-12 flex-shrink-0">
        <button 
          onClick={() => setSide('BUY')}
          className={`flex-1 font-headline-sm text-headline-sm transition-transform ${side === 'BUY' ? 'bg-secondary-container text-white active:scale-[0.98]' : 'bg-surface-container-high text-on-surface-variant hover:bg-on-tertiary-fixed-variant hover:text-white'}`}
        >BUY</button>
        <button 
          onClick={() => setSide('SELL')}
          className={`flex-1 font-headline-sm text-headline-sm transition-all ${side === 'SELL' ? 'bg-on-tertiary-container text-white active:scale-[0.98]' : 'bg-surface-container-high text-on-surface-variant hover:bg-on-tertiary-fixed-variant hover:text-white'}`}
        >SELL</button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Order Type Toggle */}
        <div className="flex p-1 bg-surface-container-low rounded border border-outline-variant">
          <button 
            onClick={() => setOrderType('LIMIT')}
            className={`flex-1 py-1.5 font-label-caps text-label-caps rounded transition-colors ${orderType === 'LIMIT' ? 'bg-surface-variant text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >LIMIT</button>
          <button 
            onClick={() => setOrderType('MARKET')}
            className={`flex-1 py-1.5 font-label-caps text-label-caps rounded transition-colors ${orderType === 'MARKET' ? 'bg-surface-variant text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >MARKET</button>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-3">
          <div className="group">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1 block">PRICE (USDT)</label>
            <input 
              className={`w-full bg-transparent border-b border-outline-variant focus:border-secondary outline-none py-1 font-data-mono-md text-data-mono-md transition-colors text-right pr-2 ${orderType === 'MARKET' ? 'opacity-50 cursor-not-allowed' : ''}`} 
              type={orderType === 'MARKET' ? 'text' : 'number'}
              value={orderType === 'MARKET' ? 'MARKET' : price}
              onChange={(e) => orderType === 'LIMIT' && setPrice(e.target.value)}
              disabled={orderType === 'MARKET'}
            />
          </div>
          <div className="group">
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-1 block">QUANTITY (BTC)</label>
            <input 
              className="w-full bg-transparent border-b border-outline-variant focus:border-secondary outline-none py-1 font-data-mono-md text-data-mono-md transition-colors text-right pr-2" 
              placeholder="0.00" 
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="text-on-tertiary-container text-sm font-body-md border border-on-tertiary-container/30 bg-on-tertiary-container/10 p-2 rounded">
            {error}
          </div>
        )}

        {/* Transaction Details */}
        <div className="bg-surface-container-high rounded p-3 flex flex-col gap-2 border border-outline-variant/30">
          <div className="flex justify-between font-label-caps text-label-caps">
            <span className="text-on-surface-variant">COST</span>
            <span className="text-on-surface">{cost} USDT</span>
          </div>
          <div className="flex justify-between font-label-caps text-label-caps">
            <span className="text-on-surface-variant">FEES (0.02%)</span>
            <span className="text-on-surface">{fees} USDT</span>
          </div>
        </div>

        {/* Execution Button */}
        <button 
          onClick={executeOrder}
          disabled={loading}
          className={`w-full py-4 rounded font-headline-sm text-headline-sm text-white shadow-lg transition-all uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : 'active:opacity-90'} ${side === 'BUY' ? 'bg-secondary-container hover:shadow-secondary/20' : 'bg-on-tertiary-container hover:shadow-on-tertiary-container/20'}`}
        >
          {loading ? 'Processing...' : `Place ${side} Order`}
        </button>

      </div>
    </div>
  );
};
