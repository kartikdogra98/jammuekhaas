import { useEffect, useState } from "react";
import api from "../../api/axios";

const Reports = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const { data } = await api.get("/admin/analytics");
      setReport(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!report) {
    return (
      <p className="text-center py-10 text-slate-700 dark:text-gray-300">
        Loading...
      </p>
    );
  }

  const stats = report.stats;

  const cards = [
    {
      title: "Total Revenue",
      value: `₹ ${Number(stats.revenue || 0).toLocaleString()}`,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "text-purple-600",
    },
    {
      title: "Total Foods",
      value: stats.totalFoods,
      color: "text-orange-600",
    },
    {
      title: "Restaurants",
      value: stats.totalRestaurants,
      color: "text-red-600",
    },
  ];

  return (
    <div className="text-slate-900 dark:text-white">

      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        Reports & Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">

        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-transparent dark:border-slate-700 p-6"
          >
            <p className="text-gray-500 dark:text-gray-300">
              {card.title}
            </p>

            <h2 className={`text-2xl sm:text-3xl font-bold mt-4 ${card.color}`}>
              {card.value}
            </h2>
          </div>
        ))}

      </div>

    </div>
  );
};

export default Reports;