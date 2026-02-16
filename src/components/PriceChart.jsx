import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function PriceChart({ history, isPositive }) {
  const chartData = {
    labels: history.map((_, i) => i),
    datasets: [
      {
        data: history,
        fill: true,
        borderColor: isPositive ? "#10b981" : "#f43f5e",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 150);
          gradient.addColorStop(0, isPositive ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    },
  };

  return (
    <div className="h-24 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
