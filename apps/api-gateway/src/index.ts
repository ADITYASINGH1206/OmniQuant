import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

interface OHLCV {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface BacktestPayload {
  initial_capital: number;
  data: OHLCV[];
  short_window?: number;
  long_window?: number;
  commission?: number;
  slippage?: number;
}

// ----------------------------------------------------------------------
// Microservices Bridge Routes
// ----------------------------------------------------------------------

app.get('/api/ping', async (req: Request, res: Response) => {
  try {
    const pythonResponse = await axios.get('http://localhost:8000/engine/ping');
    res.json({
      gateway: 'Node.js Express is healthy',
      engineResponse: pythonResponse.data
    });
  } catch (error: any) {
    res.status(502).json({ error: 'Failed to reach Python Quant Engine' });
  }
});

app.post('/api/backtest/run', async (req: Request, res: Response) => {
  try {
    const payload: BacktestPayload = req.body;
    const pythonResponse = await axios.post('http://localhost:8000/engine/backtest', payload);
    res.json({
      gateway: 'Node.js Express is healthy',
      engineResponse: pythonResponse.data
    });
  } catch (error: any) {
    res.status(502).json({ error: 'Failed to run backtest on Python Quant Engine' });
  }
});

// ----------------------------------------------------------------------
// Paper Trading Sandbox Routes
// ----------------------------------------------------------------------

interface Position {
  symbol: string;
  qty: number;
  avgPrice: number;
}

// In-Memory Mock Broker State
export interface OrderLog {
  id: string;
  timestamp: number;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'FILLED' | 'REJECTED';
}

let account = {
  cash_balance: 100000,
  realized_pnl: 0,
  positions: {} as Record<string, Position>,
  order_history: [] as OrderLog[]
};

app.get('/api/paper/account', (req: Request, res: Response) => {
  res.json(account);
});

app.post('/api/paper/order', (req: Request, res: Response) => {
  const { action, symbol, quantity, price } = req.body;
  const qty = Number(quantity);
  const prc = Number(price);
  const cost = qty * prc;
  
  const order: OrderLog = {
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    symbol,
    action,
    quantity: qty,
    price: prc,
    status: 'FILLED'
  };

  if (action === 'BUY') {
    if (account.cash_balance >= cost) {
      account.cash_balance -= cost;
      if (!account.positions[symbol]) {
        account.positions[symbol] = { symbol, qty: 0, avgPrice: 0 };
      }
      const pos = account.positions[symbol];
      // Update average entry price based on weighted average
      pos.avgPrice = ((pos.avgPrice * pos.qty) + cost) / (pos.qty + qty);
      pos.qty += qty;
      account.order_history.unshift(order); // Store at beginning
      return res.json({ status: 'success', account });
    }
    return res.status(400).json({ error: 'Insufficient funds' });
    
  } else if (action === 'SELL') {
    const pos = account.positions[symbol];
    if (pos && pos.qty >= qty) {
      account.cash_balance += cost;
      const realizedProfit = (prc - pos.avgPrice) * qty;
      account.realized_pnl += realizedProfit;
      pos.qty -= qty;
      
      if (pos.qty === 0) {
        delete account.positions[symbol];
      }
      account.order_history.unshift(order); // Store at beginning
      return res.json({ status: 'success', account });
    }
    return res.status(400).json({ error: 'Insufficient position' });
  }
  
  return res.status(400).json({ error: 'Invalid action. Must be BUY or SELL' });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  if (url.pathname === '/stream') {
    const symbol = url.searchParams.get('symbol') || 'GC=F';
    // mock kline loop for non-crypto assets
    let currentPrice = symbol === 'GC=F' ? 2000 : 1.1; 
    
    const sendCandle = () => {
      const tickVariation = currentPrice * 0.0001 * (Math.random() - 0.5);
      currentPrice += tickVariation;
      
      const msg = {
        e: "kline",
        k: {
          t: Date.now(),
          s: symbol,
          o: (currentPrice - Math.abs(tickVariation)).toFixed(4),
          c: currentPrice.toFixed(4),
          h: (currentPrice + Math.abs(tickVariation)*2).toFixed(4),
          l: (currentPrice - Math.abs(tickVariation)*2).toFixed(4),
          v: (Math.random() * 10).toFixed(2)
        }
      };
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(msg));
      }
    };

    sendCandle();
    const interval = setInterval(sendCandle, 1000);
    
    ws.on('close', () => clearInterval(interval));
  } else {
    ws.close();
  }
});

server.listen(PORT, () => {
  console.log(`[Express] API Gateway & WebSocket Proxy running on http://localhost:${PORT}`);
});
