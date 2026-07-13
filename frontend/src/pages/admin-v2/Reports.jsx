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

    return <p>Loading...</p>;

  }

  const stats = report.stats;

  return (

    <div>

      <h1 className="text-3xl font-bold mb-8">

        Reports & Analytics

      </h1>

      <div className="grid lg:grid-cols-5 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h3>Total Revenue</h3>

          <p className="text-3xl font-bold mt-3">

            ₹ {stats.totalRevenue}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3>Total Orders</h3>

          <p className="text-3xl font-bold mt-3">

            {stats.totalOrders}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3>Total Users</h3>

          <p className="text-3xl font-bold mt-3">

            {stats.totalUsers}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3>Total Foods</h3>

          <p className="text-3xl font-bold mt-3">

            {stats.totalFoods}

          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3>Restaurants</h3>

          <p className="text-3xl font-bold mt-3">

            {stats.totalRestaurants}

          </p>

        </div>

      </div>

    </div>

  );

};

export default Reports;