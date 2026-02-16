import React, { useState, useEffect } from "react"; // Added imports
import useWatchlist from "../hooks/useWatchlist";
import useCoinGeckoPrices from "../hooks/useCoinGeckoPrices";
import WatchlistSelector from "./WatchlistSelector";
import ChartCard from "./ChartCard";

// src/components/DashboardGrid.jsx
// ... (imports remain the same)

export default function DashboardGrid() {
  const [watchlist, setWatchlist] = useWatchlist();
  const { prices, loading } = useCoinGeckoPrices(watchlist);

  // 1. Move holdings to state
  const [myHoldings, setMyHoldings] = useState({
    bitcoin: 0.5,
    ethereum: 2.0,
    solana: 10.5
  });

  // 2. Function to update holding for a specific coin
  const updateHolding = (id, amount) => {
    setMyHoldings(prev => ({
      ...prev,
      [id]: parseFloat(amount) || 0
    }));
  };

  const totalValue = Object.entries(myHoldings).reduce((total, [id, qty]) => {
    const currentPrice = prices?.[id]?.usd || 0; 
    return total + (qty * currentPrice);
  }, 0);

  return (
    <div className="p-6 bg-[#0b0e11] min-h-screen text-white">
      {/* Portfolio Header stays the same */}
      <div className="max-w-7xl mx-auto mb-8 bg-[#181a20] p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Total Portfolio Value</h2>
        <p className="text-5xl font-mono font-bold text-emerald-400">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <WatchlistSelector /* ...props */ />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {watchlist.map((id) => (
            <ChartCard 
              key={id} 
              coinId={id} 
              price={prices?.[id]?.usd} 
              priceChange={prices?.[id]?.usd_24h_change} 
              qty={myHoldings[id] || 0}
              onQtyChange={(newQty) => updateHolding(id, newQty)} // 3. Pass the update function
            />
          ))}
        </div>
      </div>
    </div>
  );
}