// src/components/WatchlistSelector.jsx
import React, { useState, useEffect } from "react";
export default function WatchlistSelector({ availableCoins, selectedCoins, setSelectedCoins }) {
  const toggleCoin = (coin) => {
    const updated = selectedCoins.includes(coin)
      ? selectedCoins.filter((c) => c !== coin)
      : [...selectedCoins, coin];
    setSelectedCoins(updated);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
      {availableCoins.map((coin) => {
        const isActive = selectedCoins.includes(coin);
        return (
          <button
            key={coin}
            onClick={() => toggleCoin(coin)}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
              isActive 
                ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                : "bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            {coin}
          </button>
        );
      })}
    </div>
  );
}