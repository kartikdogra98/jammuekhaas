import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusColors = {
  placed: 'bg-slate-200 text-slate-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container-app py-10">Loading orders...</div>;

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-slate-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 flex justify-between items-center hover:shadow-lg transition-shadow">
              <div>
                <p className="font-semibold">#{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{order.restaurant?.name} • {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm font-bold text-dogra-maroon dark:text-dogra-gold mt-1">₹{order.total.toFixed(2)}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                {order.status.replace('_', ' ')}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
