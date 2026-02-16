// src/hooks/useWatchlist.js
import { useState, useEffect } from "react";

export default function useWatchlist() {
  // --- THIS IS THE CLIP ---
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem("watchlist");
    // If nothing is saved, default to bitcoin and ethereum
    return stored ? JSON.parse(stored) : ["bitcoin", "ethereum"]; 
  });
  // -------------------------

  // This part makes sure that every time you add a coin, it saves to the browser
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return [watchlist, setWatchlist];
}