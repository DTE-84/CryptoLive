import { useState, useEffect } from "react";

export default function useCoinGeckoPrices(coinIds) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coinIds.length) return;

    const fetchPrices = async () => {
      try {
        const ids = coinIds.join(",");
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("CoinGecko API Error:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [coinIds]);

  return { data, loading };
}