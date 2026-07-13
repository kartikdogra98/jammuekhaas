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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Orders Management
        </h1>

        <p className="text-gray-500">
          Track all customer orders
        </p>
      </div>
      {/* Order Statistics */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

<div className="bg-white rounded-2xl shadow p-5">
  <p className="text-gray-500 text-sm">Total Orders</p>
  <h2 className="text-3xl font-bold mt-2">
    {stats.totalOrders}
  </h2>
</div>

<div className="bg-yellow-50 rounded-2xl shadow p-5">
  <p className="text-yellow-700 text-sm">Pending Orders</p>
  <h2 className="text-3xl font-bold mt-2 text-yellow-600">
    {stats.pendingOrders}
  </h2>
</div>

<div className="bg-green-50 rounded-2xl shadow p-5">
  <p className="text-green-700 text-sm">Delivered</p>
  <h2 className="text-3xl font-bold mt-2 text-green-600">
    {stats.deliveredOrders}
  </h2>
</div>

<div className="bg-red-50 rounded-2xl shadow p-5">
  <p className="text-red-700 text-sm">Cancelled</p>
  <h2 className="text-3xl font-bold mt-2 text-red-600">
    {stats.cancelledOrders}
  </h2>
</div>

<div className="bg-blue-50 rounded-2xl shadow p-5">
  <p className="text-blue-700 text-sm">Revenue</p>
  <h2 className="text-3xl font-bold mt-2 text-blue-600">
    ₹{stats.revenue.toLocaleString()}
  </h2>
</div>

</div>

      {loading ? (
        <p className="text-center py-10">
          Loading Orders...
        </p>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Search & Filter */}

          <div className="p-6 border-b flex gap-4 flex-wrap">

            <input
              type="text"
              placeholder="Search Order..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="border rounded-lg px-4 py-3 w-80"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="border rounded-lg px-4 py-3"
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

            <table className="w-full">

              <thead className="bg-slate-100">

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
                      className="text-center py-10 text-gray-500"
                    >
                      No Orders Found
                    </td>

                  </tr>

                ) : (

                  orders.map((order) => (

                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50"
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
                          className="border rounded-lg px-3 py-2"
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

          <div className="flex justify-center items-center gap-4 py-5 border-t">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {page} of {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
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