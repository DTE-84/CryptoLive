// src/components/PriceCard.jsx
import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function PriceCard({ coin, price, history }) {
  // Calculate price change
  const change = history?.length > 1 ? price - history[history.length - 2] : 0;
  const changePercent = history?.length > 1 ? (change / history[history.length - 2]) * 100 : 0;

  const chartData = history?.map((p, i) => ({ price: p, index: i })) || [];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-1/3">
      <div className="flex-1">
        <h2 className="text-lg font-bold capitalize">{coin}</h2>
        <p className="text-xl font-semibold">
          ${price?.toLocaleString()}
          <span
            className={`ml-2 ${
              change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {change > 0 ? "▲" : change < 0 ? "▼" : ""}
            {Math.abs(changePercent).toFixed(2)}%
          </span>
        </p>
      </div>

      <div className="w-full sm:w-32 h-16">
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={change >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
