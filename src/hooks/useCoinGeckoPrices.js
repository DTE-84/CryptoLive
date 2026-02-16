import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Use environment variable or fallback to localhost
const SOCKET_SERVER = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function useCoinGeckoPrices() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(SOCKET_SERVER);

    socket.on("connect", () => {
      console.log("Connected to Net_Worth_Protocol");
    });

    socket.on("priceUpdate", (data) => {
      setPrices(data);
      setLoading(false);
    });

    socket.on("connect_error", () => {
      console.error("Connection failed. Connection URL:", SOCKET_SERVER);
      setLoading(false);
    });

    return () => socket.disconnect();
  }, []);

  return { prices, loading };
}
