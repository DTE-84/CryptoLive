import { useState, useEffect } from "react";

// Added = [] to ensure coinIds is never undefined
export default function useCoinGeckoPrices(coinIds = []) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if it's an array. 2. Check if it has items.
    if (!Array.isArray(coinIds) || coinIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchPrices = async () => {
      try {
        const ids = coinIds.join(",");
       const res = await fetch(
  `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
);
        const data = await res.json();
        
        // Only set prices if we actually got an object back
        if (data && typeof data === 'object') {
          setPrices(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [JSON.stringify(coinIds)]); // Stringify ensures the effect only triggers when the actual list changes

  return { prices, loading };
}