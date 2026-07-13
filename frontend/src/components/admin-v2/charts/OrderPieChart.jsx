import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#22C55E", // Delivered
  "#FACC15", // Preparing
  "#3B82F6", // Placed / Confirmed
  "#EF4444", // Cancelled
  "#8B5CF6", // Out for Delivery
  "#14B8A6", // Others
];

const OrderPieChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: item._id
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    value: item.value,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-semibold mb-4">
        Orders by Status
      </h2>

      {chartData.length === 0 ? (

        <div className="h-[320px] flex items-center justify-center text-gray-400">
          No order data available.
        </div>

      ) : (

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      )}

    </div>
  );
};

export default OrderPieChart;