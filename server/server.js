import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOLDINGS_FILE = path.join(__dirname, "holdings.json");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: { origin: "*", methods: ["GET", "POST"] } 
});

app.use(cors());
app.use(express.json());

// Serve static files from the React app dist folder
const frontendPath = path.resolve(__dirname, "..", "dist");
app.use(express.static(frontendPath));

// API Routes
const COINS = ["bitcoin", "ethereum", "solana", "cardano", "polkadot"];
let lastPrices = {}; // Cache for instant uplink

/**
 * HOLDINGS PERSISTENCE LOGIC
 */
async function getHoldings() {
  try {
    const data = await fs.readFile(HOLDINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return { bitcoin: 0, ethereum: 0, solana: 0, cardano: 0, polkadot: 0 };
  }
}

async function saveHoldings(holdings) {
  await fs.writeFile(HOLDINGS_FILE, JSON.stringify(holdings, null, 2));
}

/**
 * SOCKET CONNECTION LOGIC
 */
io.on("connection", (socket) => {
  console.log(`[${new Date().toLocaleTimeString()}] New Client Connected. Sending cached prices...`);
  // Immediately send the last known prices so the user doesn't wait for the next interval
  if (Object.keys(lastPrices).length > 0) {
    socket.emit("priceUpdate", lastPrices);
  }
});

/**
 * REST ENDPOINTS
 */

// Get current user holdings
app.get("/api/holdings", async (req, res) => {
  const holdings = await getHoldings();
  res.json(holdings);
});

// Update user holdings
app.post("/api/holdings", async (req, res) => {
  try {
    const newHoldings = req.body;
    await saveHoldings(newHoldings);
    res.json({ message: "Holdings updated successfully", holdings: newHoldings });
    
    // Trigger a price update immediately to refresh frontend totals
    fetchPrices();
  } catch (err) {
    res.status(500).json({ error: "Failed to save holdings" });
  }
});

// Proxy for coin history (for future charts)
app.get("/api/history/:coin", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${req.params.coin}/market_chart?vs_currency=usd&days=7`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// All other GET requests not handled will serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

/**
 * LIVE PRICE SYNC (SOCKET.IO)
 */
const fetchPrices = async () => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COINS.join(",")}&vs_currencies=usd&include_24hr_change=true`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || Object.keys(data).length === 0) return;

    const formattedData = {};
    COINS.forEach((coin) => {
      formattedData[coin] = {
        usd: data[coin]?.usd || 0,
        usd_24h_change: data[coin]?.usd_24h_change || 0,
      };
    });

    lastPrices = formattedData; // Update the cache
    console.log(`[${new Date().toLocaleTimeString()}] Syncing Net_Worth_Protocol...`);
    io.emit("priceUpdate", formattedData);
  } catch (error) {
    console.error("Net_Worth_Protocol Error:", error.message);
  }
};

// Update every 60 seconds
setInterval(fetchPrices, 60000);
fetchPrices(); // Initial load

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
  🚀 Net_Worth_Terminal Backend Operational
  📡 REST Uplink: http://localhost:${PORT}/api
  🛰️ Socket Sync: ws://localhost:${PORT}
  `);
});
