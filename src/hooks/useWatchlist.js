import { useState, useEffect } from "react";

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem("watchlist");
    return stored ? JSON.parse(stored) : ["bitcoin", "ethereum"]; 
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return [watchlist, setWatchlist];
}
