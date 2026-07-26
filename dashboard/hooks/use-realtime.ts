import { useEffect, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

export function useRealtime() {
  const [connected, setConnected] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'transaction_alert') {
        setTransactions((prev) => [data.data, ...prev].slice(0, 100));
      } else if (data.type === 'risk_alert') {
        setAlerts((prev) => [data.data, ...prev].slice(0, 50));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    return () => ws.close();
  }, []);

  return { connected, transactions, alerts };
}
