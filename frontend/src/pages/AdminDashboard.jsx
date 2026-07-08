import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import api from '../api/axios';

const COLORS = ['#7a1f2b', '#d4a017', '#fb8016', '#1f2430', '#ec600c', '#c3460c'];

const AdminDashboard = () => {
  const [tab, setTab] = useState('analytics');
  const [stats, setStats] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'flat', discountValue: '', minOrderAmount: 0, usageLimit: 100, expiresAt: '' });

  const loadAnalytics = () =>
    api.get('/admin/analytics').then((res) => {
      setStats(res.data.stats);
      setRevenueTrend(res.data.revenueTrend);
      setOrdersByStatus(res.data.ordersByStatus);
      setTopRestaurants(res.data.topRestaurants);
    });

  useEffect(() => {
    loadAnalytics();
    api.get('/coupons').then((res) => setCoupons(res.data.coupons));
    loadPendingRestaurants();
  }, []);

  const loadPendingRestaurants = () => {
    setPendingLoading(true);
    api
      .get('/admin/restaurants/pending')
      .then((res) => setPendingRestaurants(res.data.restaurants))
      .finally(() => setPendingLoading(false));
  };

  useEffect(() => {
    if (tab === 'users') api.get('/admin/users').then((res) => setUsers(res.data.users));
    if (tab === 'orders') api.get('/admin/orders').then((res) => setOrders(res.data.orders));
    if (tab === 'restaurants') loadPendingRestaurants();
  }, [tab]);

  const approveRestaurant = async (id) => {
    try {
      await api.patch(`/admin/restaurants/${id}/approve`);
      toast.success('Restaurant approved and is now live');
      setPendingRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not approve restaurant');
    }
  };

  const rejectRestaurant = async (id) => {
    if (!window.confirm('Reject and permanently remove this restaurant listing?')) return;
    try {
      await api.delete(`/admin/restaurants/${id}/reject`);
      toast.success('Restaurant rejected');
      setPendingRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reject restaurant');
    }
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/coupons', couponForm);
      setCoupons([...coupons, data.coupon]);
      toast.success('Coupon created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create coupon');
    }
  };

  const toggleUserActive = async (user) => {
    await api.put(`/admin/users/${user._id}`, { isActive: !user.isActive });
    api.get('/admin/users').then((res) => setUsers(res.data.users));
  };

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8 border-b overflow-x-auto">
        {['analytics', 'restaurants', 'users', 'orders', 'coupons'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-3 px-2 capitalize font-medium whitespace-nowrap ${tab === t ? 'border-b-2 border-dogra-maroon text-dogra-maroon' : 'text-slate-500'}`}
          >
            {t === 'restaurants' ? 'Pending Restaurants' : t}
            {t === 'restaurants' && pendingRestaurants.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-dogra-maroon text-white text-xs rounded-full w-5 h-5">
                {pendingRestaurants.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'analytics' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              ['Total Users', stats.totalUsers],
              ['Restaurants', stats.totalRestaurants],
              ['Orders', stats.totalOrders],
              ['Food Items', stats.totalFoods],
              ['Revenue', `₹${stats.totalRevenue.toFixed(0)}`],
            ].map(([label, value]) => (
              <div key={label} className="card p-5 text-center">
                <p className="text-2xl font-bold text-dogra-maroon dark:text-dogra-gold">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Revenue (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueTrend}>
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#7a1f2b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold mb-4">Orders by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={ordersByStatus} dataKey="count" nameKey="_id" outerRadius={90} label>
                    {ordersByStatus.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Top Restaurants by Revenue</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topRestaurants}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#d4a017" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'restaurants' && (
        <div>
          {pendingLoading ? (
            <p className="text-slate-500">Loading pending restaurants...</p>
          ) : pendingRestaurants.length === 0 ? (
            <p className="text-slate-500">No restaurants awaiting approval right now.</p>
          ) : (
            <div className="space-y-4">
              {pendingRestaurants.map((r) => (
                <div key={r._id} className="card p-5 flex flex-wrap justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <img
                      src={r.image?.url || 'https://placehold.co/80x80?text=Restaurant'}
                      alt={r.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-semibold">{r.name}</h4>
                      <p className="text-sm text-slate-500">{r.cuisine?.join(', ')}</p>
                      <p className="text-sm text-slate-500">
                        {r.address?.street}, {r.address?.city} - {r.address?.pincode}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Owner: {r.owner?.name} ({r.owner?.email})
                      </p>
                      <p className="text-xs text-slate-400">
                        Submitted {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approveRestaurant(r._id)} className="btn-primary text-sm py-1.5 px-4">
                      Approve
                    </button>
                    <button onClick={() => rejectRestaurant(r._id)} className="btn-outline text-sm py-1.5 px-4">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="card p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td className="capitalize">{u.role}</td>
                  <td>{u.isActive ? 'Active' : 'Deactivated'}</td>
                  <td>
                    <button onClick={() => toggleUserActive(u)} className="text-dogra-maroon text-xs">
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="card p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Order #</th><th>User</th><th>Restaurant</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b">
                  <td className="py-2">{o.orderNumber}</td>
                  <td>{o.user?.name}</td>
                  <td>{o.restaurant?.name}</td>
                  <td>₹{o.total.toFixed(2)}</td>
                  <td className="capitalize">{o.status.replace('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'coupons' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Create Coupon</h3>
            <form onSubmit={createCoupon} className="space-y-3">
              <input required placeholder="Code (e.g. SAVE20)" className="input-field" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} />
              <select className="input-field" value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}>
                <option value="flat">Flat Amount</option>
                <option value="percentage">Percentage</option>
              </select>
              <input required type="number" placeholder="Discount Value" className="input-field" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })} />
              <input type="number" placeholder="Min Order Amount" className="input-field" value={couponForm.minOrderAmount} onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })} />
              <input required type="date" className="input-field" value={couponForm.expiresAt} onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })} />
              <button type="submit" className="btn-primary w-full">Create Coupon</button>
            </form>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Active Coupons</h3>
            <div className="space-y-2">
              {coupons.map((c) => (
                <div key={c._id} className="border-b pb-2">
                  <strong>{c.code}</strong> — {c.discountType === 'flat' ? `₹${c.discountValue} off` : `${c.discountValue}% off`}
                  <p className="text-xs text-slate-500">Used {c.usedCount}/{c.usageLimit} • Expires {new Date(c.expiresAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
