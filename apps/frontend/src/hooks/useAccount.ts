import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface Position {
  symbol: string;
  qty: number;
  avgPrice: number;
}

export interface OrderLog {
  id: string;
  timestamp: number;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'FILLED' | 'REJECTED';
}

export interface AccountState {
  cash_balance: number;
  realized_pnl: number;
  positions: Record<string, Position>;
  order_history: OrderLog[];
}

export const useAccount = () => {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/paper/account');
      setAccount(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch account state');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return { account, loading, error, refreshAccount: fetchAccount };
};
