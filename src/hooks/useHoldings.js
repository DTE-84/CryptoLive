import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";
const API_URL = `${API_BASE}/api/holdings`;

export default function useHoldings() {
  const [holdings, setHoldings] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setHoldings(data))
      .catch(err => {});
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
    } finally {
      setSaving(false);
    }
  };

  return { holdings, updateHolding, saving };
}
