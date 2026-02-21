import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function useCoinGeckoPrices() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Passing empty string or no URL to io() makes it connect to the current origin
    const socket = io(API_BASE || undefined, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("priceUpdate", (data) => {
      setPrices(data);
      setLoading(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      // Fallback to loading false if we have some data or after some time
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socket.off("priceUpdate");
      socket.disconnect();
    };
  }, []);

  return { prices, loading };
}
