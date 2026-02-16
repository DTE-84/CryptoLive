// src/components/WatchlistSelector.jsx
import React from "react";

export default function WatchlistSelector({ coins, watchlist, toggleCoin }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      {coins.map((coin) => (
        <button
          key={coin}
          onClick={() => toggleCoin(coin)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            watchlist.includes(coin)
              ? "bg-green-500 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
          }`}
        >
          {coin.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
