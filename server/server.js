import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = process.cwd();
const HOLDINGS_FILE = path.join(__dirname, "holdings.json");
const DIST_PATH = path.join(ROOT_DIR, "dist");
const INDEX_HTML = path.join(DIST_PATH, "index.html");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: { origin: "*", methods: ["GET", "POST"] } 
});

app.use(cors());
app.use(express.json());

app.use(express.static(DIST_PATH));

const COINS = ["bitcoin", "ethereum", "solana", "cardano", "polkadot"];
let lastPrices = {}; 
const historyCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function getHoldings() {
  try {
    const data = await fs.readFile(HOLDINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return { 
      bitcoin: 0.25, 
      ethereum: 1.5, 
      solana: 12.0, 
      cardano: 500, 
      polkadot: 25 
    };
  }
}

async function saveHoldings(holdings) {
  await fs.writeFile(HOLDINGS_FILE, JSON.stringify(holdings, null, 2));
}

io.on("connection", (socket) => {
  if (Object.keys(lastPrices).length > 0) {
    socket.emit("priceUpdate", lastPrices);
  } else {
    fetchPrices(); // Fetch immediately if no prices yet
  }
});

app.get("/api/holdings", async (req, res) => {
  const holdings = await getHoldings();
  res.json(holdings);
});

app.post("/api/holdings", async (req, res) => {
  try {
    const newHoldings = req.body;
    await saveHoldings(newHoldings);
    res.json({ message: "Holdings updated successfully", holdings: newHoldings });
    fetchPrices();
  } catch (err) {
    res.status(500).json({ error: "Failed to save holdings" });
  }
});

app.get("/api/history/:coin", async (req, res) => {
  const { coin } = req.params;
  const now = Date.now();
  
  if (historyCache.has(coin)) {
    const { data, timestamp } = historyCache.get(coin);
    if (now - timestamp < CACHE_DURATION) {
      return res.json(data);
    }
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`
    );
    const data = await response.json();
    historyCache.set(coin, { data, timestamp: now });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.get("*", (req, res) => {
  if (req.path.includes(".")) {
    res.status(404).send("Asset not found");
  } else {
    res.sendFile(INDEX_HTML);
  }
});

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
    
    lastPrices = formattedData;
    io.emit("priceUpdate", formattedData);
  } catch (error) {
    console.error("Error fetching prices:", error.message);
  }
};

setInterval(fetchPrices, 15000); // Update every 15 seconds
fetchPrices();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
});
