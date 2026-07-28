import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

export function useRealtime() {
  const [connected, setConnected] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    function connect() {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'transaction_alert' && data.data) {
              setTransactions((prev) => [data.data, ...prev].slice(0, 100));
            } else if (data.type === 'risk_alert' && data.data) {
              setAlerts((prev) => [data.data, ...prev].slice(0, 50));
            }
          } catch {}
        };

        ws.onclose = () => {
          setConnected(false);
          wsRef.current = null;
          setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        setConnected(false);
        setTimeout(connect, 5000);
      }
    }

    connect();

    const pollInterval = setInterval(async () => {
      try {
        const data = await api.getTransactions(20);
        if (data?.transactions) {
          setTransactions(data.transactions.reverse());
        }
      } catch {}
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { connected, transactions, alerts };
}
