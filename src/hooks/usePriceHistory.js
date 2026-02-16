import { useState, useEffect } from "react";

export default function usePriceHistory(symbol) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`http://localhost:5000/price/${symbol}`);
        const data = await res.json();

        const newPrice = data[symbol]?.usd ?? null;

        setHistory((prev) => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString(),
            price: newPrice,
          },
        ]);
      } catch (err) {
        console.error("History error:", err);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  return history;
}
