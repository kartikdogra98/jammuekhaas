import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-semibold mb-5">
        Revenue Trend
      </h2>

      {data.length === 0 ? (

        <div className="h-[320px] flex items-center justify-center text-gray-400">
          No revenue data available yet.
        </div>

      ) : (

        <ResponsiveContainer width="100%" height={320}>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="_id"
              tick={{ fontSize: 12 }}
            />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#7C1D1D"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />

          </LineChart>

        </ResponsiveContainer>

      )}

    </div>
  );
};

export default RevenueChart;