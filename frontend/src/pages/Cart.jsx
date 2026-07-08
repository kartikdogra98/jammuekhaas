import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { fetchCart, updateCartItem, removeCartItem } from '../redux/slices/cartSlice';
import api from '../api/axios';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const applyCoupon = async () => {
    try {
      const { data } = await api.post('/coupons/apply', { code: couponCode });
      setDiscount(data.discount);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="font-display text-2xl font-bold mb-4">Your Cart</h1>
        {items.map((item) => (
          <div key={item.food._id} className="card p-4 flex items-center gap-4">
            <img src={item.food.image?.url || 'https://placehold.co/80x80'} alt={item.food.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <h4 className="font-semibold">{item.food.name}</h4>
              <p className="text-dogra-maroon dark:text-dogra-gold font-bold">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2 border rounded-full px-2 py-1">
              <button onClick={() => dispatch(updateCartItem({ foodId: item.food._id, quantity: item.quantity - 1 }))}><FiMinus /></button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(updateCartItem({ foodId: item.food._id, quantity: item.quantity + 1 }))}><FiPlus /></button>
            </div>
            <button onClick={() => dispatch(removeCartItem(item.food._id))} className="text-red-500">
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      <div className="card p-6 h-fit">
        <h3 className="font-display text-lg font-bold mb-4">Order Summary</h3>
        <div className="flex gap-2 mb-4">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon code"
            className="input-field"
          />
          <button onClick={applyCoupon} className="btn-outline whitespace-nowrap">Apply</button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
          <p className="text-slate-500 text-xs">Delivery fee &amp; tax calculated at checkout.</p>
        </div>
        <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
