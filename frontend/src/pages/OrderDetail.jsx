import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';

const steps = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const load = () => api.get(`/orders/${id}`).then((res) => setOrder(res.data.order));

  useEffect(() => {
    load();
    // Poll for live status updates every 15s (simple live tracking without websockets)
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const cancelOrder = async () => {
    try {
      await api.patch(`/orders/${id}/cancel`, { reason: 'Changed my mind' });
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { order: id, restaurant: order.restaurant._id, rating, comment });
      toast.success('Thanks for your review!');
      setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    }
  };

  if (!order) return <div className="container-app py-10">Loading order...</div>;

  const currentStepIdx = order.status === 'cancelled' ? -1 : steps.indexOf(order.status);

  return (
    <div className="container-app py-10 max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
      <p className="text-slate-500 mb-6">{order.restaurant?.name} • Placed on {new Date(order.createdAt).toLocaleString()}</p>

      {order.status === 'cancelled' ? (
        <div className="card p-6 mb-6 text-red-600">This order was cancelled. Reason: {order.cancelReason}</div>
      ) : (
        <div className="card p-6 mb-6">
          <div className="flex justify-between">
            {steps.map((s, idx) => (
              <div key={s} className="flex-1 flex flex-col items-center text-center">
                <FiCheckCircle className={`text-2xl ${idx <= currentStepIdx ? 'text-green-600' : 'text-slate-300'}`} />
                <span className="text-xs mt-1 capitalize">{s.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-6 mb-6">
        <h3 className="font-semibold mb-3">Items</h3>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm mb-1">
            <span>{item.name} x{item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery Fee</span><span>₹{order.deliveryFee.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{order.tax.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
        </div>
      </div>

      {['placed', 'confirmed'].includes(order.status) && (
        <button onClick={cancelOrder} className="btn-outline mb-6">Cancel Order</button>
      )}

      {order.status === 'delivered' && (
        <div className="card p-6">
          <h3 className="font-semibold mb-3">Rate your experience</h3>
          <form onSubmit={submitReview} className="space-y-3">
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-field w-auto">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>)}
            </select>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your feedback..." className="input-field" rows={3} />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
