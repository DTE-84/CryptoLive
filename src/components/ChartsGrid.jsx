import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import usePrices from "../hooks/usePrices";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function ChartsGrid() {
  const prices = usePrices();
  const [history, setHistory] = useState({});

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    setHistory((prev) => {
      const updated = { ...prev };
      Object.keys(prices).forEach((coin) => {
        if (!updated[coin]) updated[coin] = [];
        updated[coin] = [
          ...updated[coin],
          { time: timestamp, price: prices[coin]?.usd },
        ];
        if (updated[coin].length > 20) updated[coin].shift(); // last 20 points
      });
      return updated;
    });
  }, [prices]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {Object.keys(history).map((coin) => (
        <div
          key={coin}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <h3 className="text-lg font-semibold mb-2">
            {coin.toUpperCase()} Price Chart
          </h3>
          <Line
            data={{
              labels: history[coin].map((p) => p.time),
              datasets: [
                {
                  label: `${coin.toUpperCase()} USD`,
                  data: history[coin].map((p) => p.price),
                  borderColor: "rgba(34,197,94,1)",
                  backgroundColor: "rgba(34,197,94,0.2)",
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { x: { display: true }, y: { display: true } },
            }}
          />
        </div>
      ))}
    </div>
  );
}
