import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function PriceChart({ symbol, history }) {
  const data = {
    labels: history.map((_, i) => i + 1),
    datasets: [
      {
        label: `${symbol.toUpperCase()} Price`,
        data: history,
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}
