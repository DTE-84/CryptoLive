import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

export default function Chart({ history }) {

  // Prevent crash if history not ready yet
  if (!history || history.length < 2) {
    return (
      <div className="h-16 flex items-center justify-center text-xs text-gray-400">
        Loading chart...
      </div>
    );
  }

  const chartData = history.map((price, i) => ({
    time: i,
    price
  }));

  return (
    <div className="w-full h-16">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
