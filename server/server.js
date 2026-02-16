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

const COINS = ["bitcoin", "ethereum", "solana", "cardano", "polkadot"];

/**
 * HOLDINGS PERSISTENCE LOGIC
 */
async function getHoldings() {
  try {
    const data = await fs.readFile(HOLDINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return default empty holdings
    return { bitcoin: 0, ethereum: 0, solana: 0, cardano: 0, polkadot: 0 };
  }
}

async function saveHoldings(holdings) {
  await fs.writeFile(HOLDINGS_FILE, JSON.stringify(holdings