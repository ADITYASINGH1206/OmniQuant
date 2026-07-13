import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TradingChart } from "../TradingChart";
import { PaperTrading } from "../PaperTrading";
import { useAccount } from "../hooks/useAccount";
import { useMultiMarketStream } from "../hooks/useMultiMarketStream";
import { TICKER_REGISTRY } from "../lib/tickerRegistry";

export const Terminal: React.FC = () => {
  const { account, refreshAccount } = useAccount();
  const [activeTicker, setActiveTicker] = useState<string>("BTC/USDT");
  const [activeTimeframe, setActiveTimeframe] = useState<string>("15m");
  const [ledgerTab, setLedgerTab] = useState<'POSITIONS' | 'HISTORY'>('POSITIONS');
  const { latestCandle } = useMultiMarketStream(activeTicker, activeTimeframe);

  const markPrice = latestCandle?.close || 0;

  return (
    <div className="bg-surface text-on-surface h-screen w-screen overflow-hidden">
      {/* Top Command Bar (Shared Component: TopNavBar) */}
      <header className="flex justify-between items-center w-full px-gutter h-12 z-50 bg-surface dark:bg-surface border-b border-outline-variant fixed top-0 left-0">
        <div className="flex items-center gap-6 h-full">
          <span className="font-display-ticker text-display-ticker text-primary tracking-tighter">TERMINAL.OS</span>
          
          <div className="flex gap-4 ml-6 items-center border-l border-outline-variant pl-6">
            <button className="font-label-caps text-label-caps text-secondary border-b-2 border-secondary pb-1">LIVE TERMINAL</button>
            <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors pb-1">BACKTESTER</button>
            <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors pb-1">SCREENER</button>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-lg border border-outline-variant hover:bg-surface-bright transition-colors ml-4 relative">
            <select 
              value={activeTicker}
              onChange={(e) => setActiveTicker(e.target.value)}
              className="appearance-none bg-transparent font-data-mono-md text-data-mono-md text-secondary outline-none cursor-pointer pr-4"
            >
              {Object.keys(TICKER_REGISTRY).map((ticker) => (
                <option key={ticker} value={ticker} className="bg-surface-container text-on-surface">
                  {ticker}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 pointer-events-none">expand_more</span>
          </div>

          {/* Timeframe Pills */}
          <div className="flex items-center gap-1">
            {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
              <button 
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-2 py-0.5 rounded font-label-caps text-label-caps uppercase transition-colors ${
                  activeTimeframe === tf 
                    ? "bg-surface-variant text-secondary border-b-2 border-secondary pb-1" 
                    : "text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-label-caps text-label-caps text-on-surface-variant leading-none">CASH BALANCE</p>
              <p className="font-data-mono-md text-data-mono-md text-secondary">
                {account ? account.cash_balance.toFixed(2) : '---'} <span className="text-[10px] text-on-surface-variant">USDT</span>
              </p>
            </div>
            <div className="text-right border-l border-outline-variant pl-3">
              <p className="font-label-caps text-label-caps text-on-surface-variant leading-none">REALIZED PNL</p>
              <p className={`font-data-mono-md text-data-mono-md ${account && account.realized_pnl >= 0 ? 'text-secondary' : 'text-on-tertiary-container'}`}>
                {account ? (account.realized_pnl >= 0 ? '+' : '') + account.realized_pnl.toFixed(2) : '---'} <span className="text-[10px] text-on-surface-variant">USDT</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
            <span className="material-symbols-outlined text-primary cursor-pointer">account_circle</span>
          </div>
        </div>
      </header>

      {/* Side Navigation (Shared Component: SideNavBar) */}
      <nav className="fixed left-0 top-12 bottom-0 flex flex-col items-center py-4 z-40 bg-surface-container border-r border-outline-variant w-16 bg-surface-container-high backdrop-blur-md transition-all duration-150">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="group flex flex-col items-center gap-1 cursor-pointer w-full py-2 text-secondary bg-surface-variant border-r-2 border-secondary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
            <span className="font-label-caps text-label-caps">ORDERS</span>
          </div>
          <div className="group flex flex-col items-center gap-1 cursor-pointer w-full py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="font-label-caps text-label-caps">WALLETS</span>
          </div>
          <div className="group flex flex-col items-center gap-1 cursor-pointer w-full py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all">
            <span className="material-symbols-outlined">notification_important</span>
            <span className="font-label-caps text-label-caps">ALERTS</span>
          </div>
          <div className="group flex flex-col items-center gap-1 cursor-pointer w-full py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all">
            <span className="material-symbols-outlined">visibility</span>
            <span className="font-label-caps text-label-caps">WATCH</span>
          </div>
          <div className="group flex flex-col items-center gap-1 cursor-pointer w-full py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-all">
            <span className="material-symbols-outlined">history</span>
            <span className="font-label-caps text-label-caps">HISTORY</span>
          </div>
        </div>
        <div className="mt-auto flex flex-col items-center gap-6 w-full">
          <div className="group flex flex-col items-center gap-1 cursor-pointer w-full py-2 text-on-surface-variant hover:text-on-surface transition-all">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-caps text-label-caps">HELP</span>
          </div>
          <div className="group flex flex-col items-center gap-1 cursor-pointer w-full py-2 text-on-surface-variant hover:text-on-surface transition-all">
            <span className="material-symbols-outlined">code</span>
            <span className="font-label-caps text-label-caps">API</span>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="fixed top-12 left-16 right-0 bottom-0 flex flex-col md:flex-row bg-background">
        {/* Left Section: Chart & Ledger */}
        <section className="flex-1 flex flex-col border-r border-outline-variant overflow-hidden">
          {/* Chart Area */}
          <div className="flex-1 relative bg-surface-container-lowest overflow-hidden group">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <div className="w-full h-full border-[0.5px] border-outline-variant/10 grid grid-cols-6 grid-rows-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-outline-variant/10"></div>
                ))}
              </div>
            </div>
            <div className="relative z-10 w-full h-full flex flex-col p-2">
              <TradingChart activeTicker={activeTicker} activeTimeframe={activeTimeframe} latestCandle={latestCandle} />
            </div>
          </div>
          
          {/* Bottom Ledger (Positions Table) */}
          <div className="h-64 border-t border-outline-variant bg-surface-container flex flex-col">
            <div className="flex items-center px-gutter h-8 border-b border-outline-variant bg-surface-container-high">
              <button 
                onClick={() => setLedgerTab('POSITIONS')}
                className={`px-3 h-full font-label-caps text-label-caps transition-colors ${ledgerTab === 'POSITIONS' ? 'text-secondary border-b-2 border-secondary bg-surface-variant' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                OPEN POSITIONS ({account ? Object.keys(account.positions).length : 0})
              </button>
              <button 
                onClick={() => setLedgerTab('HISTORY')}
                className={`px-3 h-full font-label-caps text-label-caps transition-colors ${ledgerTab === 'HISTORY' ? 'text-secondary border-b-2 border-secondary bg-surface-variant' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                ORDER HISTORY
              </button>
              <button 
                onClick={() => setLedgerTab('HISTORY')}
                className={`px-3 h-full font-label-caps text-label-caps transition-colors ${ledgerTab === 'HISTORY' ? 'text-secondary border-b-2 border-secondary bg-surface-variant' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                TRADE LOGS
              </button>
              <div className="ml-auto flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer">filter_list</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer">close_fullscreen</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {ledgerTab === 'POSITIONS' ? (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container-high z-10">
                    <tr className="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                      <th className="py-2 px-3 font-medium">SYMBOL</th>
                      <th className="py-2 px-3 font-medium">TYPE</th>
                      <th className="py-2 px-3 font-medium">SIZE</th>
                      <th className="py-2 px-3 font-medium">ENTRY PRICE</th>
                      <th className="py-2 px-3 font-medium">MARK PRICE</th>
                      <th className="py-2 px-3 font-medium text-right">UNREALIZED PNL</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-mono-sm text-data-mono-sm">
                    {account && Object.values(account.positions).map((pos, i) => {
                      const pnl = (markPrice - pos.avgPrice) * pos.qty;
                      const pnlPct = (pnl / (pos.avgPrice * pos.qty)) * 100;
                      const pnlColor = pnl >= 0 ? 'text-secondary' : 'text-on-tertiary-container';
                      return (
                        <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-bright transition-colors">
                          <td className="py-cell-padding-y px-3 text-on-surface">{pos.symbol}</td>
                          <td className="py-cell-padding-y px-3 text-secondary">MARKET</td>
                          <td className="py-cell-padding-y px-3">{pos.qty.toFixed(4)}</td>
                          <td className="py-cell-padding-y px-3">{pos.avgPrice.toFixed(2)}</td>
                          <td className="py-cell-padding-y px-3">{markPrice.toFixed(2)}</td>
                          <td className={`py-cell-padding-y px-3 text-right ${pnlColor}`}>
                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnl >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                          </td>
                        </tr>
                      );
                    })}
                    {(!account || Object.keys(account.positions).length === 0) && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-on-surface-variant">No Open Positions</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container-high z-10">
                    <tr className="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                      <th className="py-2 px-3 font-medium">TIME</th>
                      <th className="py-2 px-3 font-medium">SYMBOL</th>
                      <th className="py-2 px-3 font-medium">SIDE</th>
                      <th className="py-2 px-3 font-medium">PRICE</th>
                      <th className="py-2 px-3 font-medium">QUANTITY</th>
                      <th className="py-2 px-3 font-medium text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-mono-sm text-data-mono-sm">
                    {account && account.order_history && account.order_history.map((order, i) => (
                      <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-bright transition-colors">
                        <td className="py-cell-padding-y px-3 text-on-surface-variant">{new Date(order.timestamp).toLocaleTimeString()}</td>
                        <td className="py-cell-padding-y px-3 text-on-surface">{order.symbol}</td>
                        <td className={`py-cell-padding-y px-3 ${order.action === 'BUY' ? 'text-secondary' : 'text-on-tertiary-container'}`}>{order.action}</td>
                        <td className="py-cell-padding-y px-3">{order.price.toFixed(2)}</td>
                        <td className="py-cell-padding-y px-3">{order.quantity.toFixed(4)}</td>
                        <td className="py-cell-padding-y px-3 text-right text-secondary">{order.status}</td>
                      </tr>
                    ))}
                    {(!account || !account.order_history || account.order_history.length === 0) && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-on-surface-variant font-label-caps">No order history found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        {/* Right Sidebar Dock (Order Entry) */}
        <aside className="w-full md:w-80 flex flex-col bg-surface-container border-l border-outline-variant" style={{ overflowY: "auto" }}>
          <PaperTrading onOrderSuccess={refreshAccount} activeTicker={activeTicker} markPrice={markPrice} />
        </aside>
      </main>
    </div>
  );
};
