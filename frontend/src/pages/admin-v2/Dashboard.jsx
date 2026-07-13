import { useEffect, useState } from "react";
import api from "../../api/axios";

import RevenueChart from "../../components/admin-v2/charts/RevenueChart";
import OrderPieChart from "../../components/admin-v2/charts/OrderPieChart";
import RecentOrders from "../../components/admin-v2/tables/RecentOrders";
import TopRestaurants from "../../components/admin-v2/widgets/TopRestaurants";
import TopFoods from "../../components/admin-v2/widgets/TopFoods";

import {
  FiUsers,
  FiShoppingBag,
  FiCoffee,
  FiClipboard,
  FiDollarSign,
} from "react-icons/fi";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    stats: {},
    revenueTrend: [],
    orderStatus: [],
    topRestaurants: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/admin/analytics");

      setAnalytics(data);
    } catch (err) {
      console.log(err);
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: analytics.stats.totalUsers || 0,
      icon: FiUsers,
      color: "bg-blue-500",
    },
    {
      title: "Restaurants",
      value: analytics.stats.totalRestaurants || 0,
      icon: FiShoppingBag,
      color: "bg-green-500",
    },
    {
      title: "Foods",
      value: analytics.stats.totalFoods || 0,
      icon: FiCoffee,
      color: "bg-yellow-500",
    },
    {
      title: "Orders",
      value: analytics.stats.totalOrders || 0,
      icon: FiClipboard,
      color: "bg-purple-500",
    },
    {
      title: "Revenue",
      value: `₹${(analytics.stats.revenue || 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">
        Dashboard
      </h1>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white`}
                >
                  <Icon size={30} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-6 mt-10">

        <RevenueChart data={analytics.revenueTrend} />

        <OrderPieChart data={analytics.orderStatus} />

      </div>

      {/* Recent Orders */}

      <div className="mt-8">
        <RecentOrders />
      </div>

      {/* Top Restaurants */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

    <TopRestaurants
        restaurants={analytics.topRestaurants}
    />

    <TopFoods
        foods={analytics.topFoods}
    />

</div>

    </div>
  );
};

export default Dashboard;