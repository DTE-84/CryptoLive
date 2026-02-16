import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// AUTO-DETECT: Use VITE_API_URL or fallback to current site origin
const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;
// Ensure protocol is correct for socket
const SOCKET_SERVER = API_BASE.replace("https://", "wss://").replace("http://", "ws://");

export default function useCoinGeckoPrices() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Connecting to Net_Worth_Protocol at:", SOCKET_SERVER);
    const socket = io(API_BASE, {
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      console.log("✅ Linked to Net_Worth_Protocol");
    });

    socket.on("priceUpdate", (data) => {
      console.log("📡 Prices Received:", data);
      setPrices(data);
      setLoading(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Uplink Failure:", err.message);
      // Don't set loading to false here, keep trying
    });

    return () => socket.disconnect();
  }, []);

  return { prices, loading };
}
