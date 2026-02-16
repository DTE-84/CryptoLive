import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/holdings`;

export default function useHoldings() {
  const [holdings, setHoldings] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setHoldings(data))
      .catch(err => console.error("Failed to load holdings:", err));
  }, []);

  const updateHolding = async (coinId, quantity) => {
    const updated = { ...holdings, [coinId]: parseFloat(quantity) || 0 };
    setHoldings(updated);
    
    setSaving(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to sync holdings:", err);
    } finally {
      setSaving(false);
    }
  };

  return { holdings, updateHolding, saving };
}
