import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function useCoinHistory(coinId) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coinId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/history/${coinId}`);
        const data = await res.json();
        
        // CoinGecko returns [timestamp, price] pairs in 'prices' array
        if (data && data.prices) {
          setHistory(data.prices.map(p => p[1]));
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch history for", coinId, err);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [coinId]);

  return { history, loading };
}
