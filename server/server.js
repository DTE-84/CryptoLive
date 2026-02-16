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
// Use process.cwd() to ensure we are in the root directory
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

// Log server status on start
console.log("-------------------------------------------");
console.log("NET_WORTH_TERMINAL STARTUP SEQUENCE");
console.log(`Current Working Dir: ${ROOT_DIR}`);
console.log(`Dist Path Target: ${DIST_PATH}`);
console.log(`Index HTML Exists: ${fsSync.existsSync(INDEX_HTML)}`);
if (fsSync.existsSync(DIST_PATH)) {
  console.log(`Dist Contents: ${fsSync.readdirSync(DIST_PATH).join(", ")}`);
  const assetsPath = path.join(DIST_PATH, "assets");
  if (fsSync.existsSync(assetsPath)) {
    console.log(`Assets Contents: ${fsSync.readdirSync(assetsPath).join(", ")}`);
  }
}
console.log("-------------------------------------------");

// Serve static files from the React app dist folder
app.use(express.static(DIST_PATH));

const COINS = ["bitcoin", "ethereum", "solana", "cardano", "polkadot"];
let lastPrices = {}; 

async function getHoldings() {
  try {
    const data = await fs.readFile(HOLDINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return seed data so dashboard isn't empty on first run
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
  }
});

/**
 * REST ENDPOINTS
 */
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

// CATCH-ALL: Only serve index.html if the request doesn't look like a file
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
    console.error("Net_Worth_Protocol Error:", error.message);
  }
};

setInterval(fetchPrices, 60000);
fetchPrices();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 System Live on Port ${PORT}`);
});
