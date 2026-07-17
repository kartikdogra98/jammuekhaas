import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FiEye } from "react-icons/fi";
import OrderModal from "../../components/admin-v2/modals/OrderModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [search, statusFilter, page]);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/admin/orders", {
        params: {
          search,
          status: statusFilter,
          page,
        },
      });

      setOrders(data.orders || []);
      setPages(data.pages || 1);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/orders/stats");
  
      setStats(data.stats || data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, {
        status,
      });

      toast.success("Order status updated");

      fetchOrders();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Failed to update status"
      );
    }
  };

  return (
    <div className="text-slate-900 dark:text-white">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Orders Management
        </h1>

        <p className="text-gray-500 dark:text-gray-300">
          Track all customer orders
        </p>
      </div>
      {/* Order Statistics */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

<div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 border border-transparent dark:border-slate-700">
<p className="text-gray-500 dark:text-gray-300 text-sm">Total Orders</p>
<h2 className="text-2xl sm:text-3xl font-bold mt-2 text-slate-900 dark:text-white">
    {stats.totalOrders}
  </h2>
</div>

<div className="bg-yellow-50 dark:bg-slate-800 rounded-2xl shadow p-5 border border-transparent dark:border-slate-700">
  <p className="text-yellow-700 text-sm">Pending Orders</p>
  <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-yellow-600">
    {stats.pendingOrders}
  </h2>
</div>

<div className="bg-green-50 dark:bg-slate-800 rounded-2xl shadow p-5 border border-transparent dark:border-slate-700">
  <p className="text-green-700 text-sm">Delivered</p>
  <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-green-600">
    {stats.deliveredOrders}
  </h2>
</div>

<div className="bg-red-50 dark:bg-slate-800 rounded-2xl shadow p-5 border border-transparent dark:border-slate-700">
  <p className="text-red-700 text-sm">Cancelled</p>
  <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-red-600">
    {stats.cancelledOrders}
  </h2>
</div>

<div className="bg-blue-50 dark:bg-slate-800 rounded-2xl shadow p-5 border border-transparent dark:border-slate-700">
  <p className="text-blue-700 text-sm">Revenue</p>
  <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-blue-600">
    ₹{stats.revenue.toLocaleString()}
  </h2>
</div>

</div>

      {loading ? (
        <p className="text-center py-10">
          Loading Orders...
        </p>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-transparent dark:border-slate-700">

          {/* Search & Filter */}

          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Search Order..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full md:w-80 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-3"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
             className="w-full md:w-56 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-3"
            >
              <option value="">All Status</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">
                Out For Delivery
              </option>
              <option value="delivered">
                Delivered
              </option>
              <option value="cancelled">
                Cancelled
              </option>
            </select>

          </div>

          <div className="overflow-x-auto">

          <table className="min-w-[750px] w-full">

            <thead className="bg-slate-100 dark:bg-slate-700">

                <tr>
                  <th className="p-4">Order ID</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {orders.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="text-center py-10 text-gray-500 dark:text-gray-300"
                    >
                      No Orders Found
                    </td>

                  </tr>

                ) : (

                  orders.map((order) => (

                    <tr
                      key={order._id}
                      className="w-full md:w-56 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-3"
                    >
                      <td className="p-4">
                        {order.orderNumber || order._id.slice(-6)}
                      </td>

                      <td>{order.user?.name}</td>

                      <td>{order.restaurant?.name}</td>

                      <td>₹ {order.total}</td>

                      <td>{order.paymentStatus}</td>

                      <td>

                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order._id,
                              e.target.value
                            )
                          }
                         className="w-full md:w-56 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg px-4 py-3"
                        >
                          <option value="placed">
                            Placed
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="preparing">
                            Preparing
                          </option>

                          <option value="out_for_delivery">
                            Out For Delivery
                          </option>

                          <option value="delivered">
                            Delivered
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>

                        </select>

                      </td>

                      <td>
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td>

                        <button
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          <FiEye />
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}

          <div className="flex justify-center items-center gap-4 py-5 border-t border-gray-200 dark:border-slate-700">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-white disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-slate-700 dark:text-gray-200">
              Page {page} of {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-white disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      )}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;