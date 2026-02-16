import { useState, useEffect } from "react";

// AUTO-DETECT: Use VITE_API_URL or fallback to current site origin
const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;
const API_URL = `${API_BASE}/api/holdings`;

export default function useHoldings() {
  const [holdings, setHoldings] = useState({});
  const [saving, setSaving] = useState(false);

  // Fetch initial holdings
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
