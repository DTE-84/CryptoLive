// src/components/CoinChart.jsx
import { Line } from "react-chartjs-2";
// ... (keep your ChartJS.register imports) ...
// src/components/CoinChart.jsx
export default function CoinChart({ symbol, history = [], change }) {
  // Use Optional Chaining (?.) and provide a fallback array []
  const labels = (history || []).map((_, i) => i + 1);
  const dataPoints = (history || []).map(item => item.price || item);

  const dchartData = {
    labels: labels,
    datasets: [
      {
        label: symbol?.toUpperCase(),
        data: dataPoints,
        borderColor: change === 1 ? "#22c55e" : change === -1 ? "#ef4444" : "#3b82f6",
        backgroundColor: "transparent",
        tension: 0.3,
      },
    ],
  };

  return <Line data={dchartData} options={options} />;
}