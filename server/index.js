import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const COINS = ["bitcoin", "ethereum", "solana", "cardano", "polkadot"];

const fetchPrices = async () => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COINS.join(",")}&vs_currencies=usd&include_24hr_change=true`;
    const response = await fetch(url);
    const data = await response.json();

    // SAFETY CHECK: Ensure data actually exists before processing
    if (!data || Object.keys(data).length === 0) {
      console.warn(
        "⚠️ CoinGecko returned empty data. Waiting for next interval.",
      );
      return;
    }

    const formattedData = {};
    COINS.forEach((coin) => {
      // The "?." and "|| 0" prevent the crash if a coin is missing from the API response
      formattedData[coin] = {
        usd: data[coin]?.usd || 0,
        usd_24h_change: data[coin]?.usd_24h_change || 0,
      };
    });

    console.log("✅ Prices updated:", new Date().toLocaleTimeString());
    io.emit("priceUpdate", formattedData);
  } catch (error) {
    // This catches network errors so the server stays alive
    console.error("❌ Network Error fetching prices:", error.message);
  }
};

// Update every 60 seconds (CoinGecko free tier friendly)
setInterval(fetchPrices, 60000);
fetchPrices(); // Run once on startup

server.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000"),
);
