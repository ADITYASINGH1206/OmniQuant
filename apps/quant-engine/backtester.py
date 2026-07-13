from typing import List, Dict, Any
from pydantic import BaseModel

class OHLCV(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: float

class BacktestRequest(BaseModel):
    initial_capital: float = 10000.0
    data: List[OHLCV]
    short_window: int = 10
    long_window: int = 30
    commission: float = 0.001
    slippage: float = 0.0005

class EventDrivenBacktester:
    def __init__(self, request: BacktestRequest):
        self.data = request.data
        self.initial_capital = request.initial_capital
        self.cash = self.initial_capital
        self.position = 0.0
        self.commission_rate = request.commission
        self.slippage_rate = request.slippage
        
        # Strategy Parameters
        self.short_window = request.short_window
        self.long_window = request.long_window
        
        self.trades_journal = []
        self.equity_curve = []

    def run(self) -> Dict[str, Any]:
        prices = []
        
        for i, bar in enumerate(self.data):
            prices.append(bar.close)
            
            # We need enough data to calculate MAs
            if len(prices) > self.long_window:
                short_ma = sum(prices[-self.short_window:]) / self.short_window
                long_ma = sum(prices[-self.long_window:]) / self.long_window
                
                # Trading Logic (MA Crossover)
                if short_ma > long_ma and self.position == 0:
                    self._buy(bar, prices[-1])
                elif short_ma < long_ma and self.position > 0:
                    self._sell(bar, prices[-1])
            
            # Record Equity Curve
            current_value = self.cash + (self.position * bar.close)
            self.equity_curve.append({"timestamp": bar.timestamp, "equity": current_value})

        # Calculate metrics
        final_value = self.cash + (self.position * (self.data[-1].close if self.data else 0))
        total_return = (final_value - self.initial_capital) / self.initial_capital
        
        return {
            "initial_capital": self.initial_capital,
            "final_equity": final_value,
            "total_return_pct": total_return * 100,
            "total_trades": len(self.trades_journal),
            "trades_journal": self.trades_journal,
            "equity_curve": self.equity_curve
        }

    def _buy(self, bar: OHLCV, price: float):
        # Calculate execution price with slippage
        exec_price = price * (1 + self.slippage_rate)
        max_units = self.cash / exec_price
        
        # Buy all we can
        if max_units > 0:
            cost = max_units * exec_price
            commission = cost * self.commission_rate
            
            self.cash -= (cost + commission)
            self.position += max_units
            
            self.trades_journal.append({
                "action": "BUY",
                "timestamp": bar.timestamp,
                "price": exec_price,
                "units": max_units,
                "commission": commission
            })

    def _sell(self, bar: OHLCV, price: float):
        exec_price = price * (1 - self.slippage_rate)
        revenue = self.position * exec_price
        commission = revenue * self.commission_rate
        
        self.cash += (revenue - commission)
        
        self.trades_journal.append({
            "action": "SELL",
            "timestamp": bar.timestamp,
            "price": exec_price,
            "units": self.position,
            "commission": commission
        })
        self.position = 0.0
