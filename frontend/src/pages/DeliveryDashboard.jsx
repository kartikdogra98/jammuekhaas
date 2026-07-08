import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const DeliveryDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [form, setForm] = useState({ vehicleType: 'bike', vehicleNumber: '' });

  const loadAll = () => {
    api.get('/delivery/available-orders').then((res) => setAvailable(res.data.orders)).catch(() => {});
    api.get('/delivery/orders').then((res) => setAssigned(res.data.orders)).catch(() => {});
  };

  useEffect(() => {
    api
      .get('/delivery/profile')
      .then((res) => setProfile(res.data.profile))
      .catch(() => setProfile(null));
    loadAll();
  }, []);

  const createProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/delivery/profile', form);
      setProfile(data.profile);
      toast.success('Profile created! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create profile');
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await api.patch(`/delivery/orders/${orderId}/accept`);
      toast.success('Order accepted for delivery');
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept order');
    }
  };

  const markDelivered = async (orderId) => {
    await api.patch(`/orders/${orderId}/status`, { status: 'delivered' });
    loadAll();
  };

  if (!profile) {
    return (
      <div className="container-app py-10 max-w-md">
        <h1 className="font-display text-2xl font-bold mb-6">Become a Delivery Partner</h1>
        <form onSubmit={createProfile} className="card p-6 space-y-3">
          <select className="input-field" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="bicycle">Bicycle</option>
            <option value="car">Car</option>
          </select>
          <input placeholder="Vehicle Number" className="input-field" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} />
          <button type="submit" className="btn-primary w-full">Register as Delivery Partner</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">Delivery Dashboard</h1>
        <span className={`text-xs px-3 py-1 rounded-full ${profile.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {profile.isApproved ? 'Approved' : 'Pending Approval'}
        </span>
      </div>

      <h2 className="font-semibold text-lg mb-3">Available Orders</h2>
      <div className="space-y-3 mb-8">
        {available.length === 0 ? <p className="text-slate-500">No orders available for pickup right now.</p> : (
          available.map((order) => (
            <div key={order._id} className="card p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">#{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{order.restaurant?.name}</p>
              </div>
              <button onClick={() => acceptOrder(order._id)} className="btn-primary text-sm py-1.5 px-4">Accept</button>
            </div>
          ))
        )}
      </div>

      <h2 className="font-semibold text-lg mb-3">My Assigned Deliveries</h2>
      <div className="space-y-3">
        {assigned.length === 0 ? <p className="text-slate-500">No active deliveries.</p> : (
          assigned.map((order) => (
            <div key={order._id} className="card p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">#{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{order.user?.name} • {order.status.replace('_', ' ')}</p>
              </div>
              {order.status !== 'delivered' && (
                <button onClick={() => markDelivered(order._id)} className="btn-outline text-sm py-1.5 px-4">Mark Delivered</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
