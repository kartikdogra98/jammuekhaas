import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchCart, clearCart } from '../redux/slices/cartSlice';
import api from '../api/axios';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', pincode: '', phone: '', label: 'Home' });

  useEffect(() => {
    dispatch(fetchCart());
    api.get('/addresses').then((res) => {
      setAddresses(res.data.addresses);
      const def = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
      if (def) setSelectedAddress(def);
    }).catch(() => {});
  }, [dispatch]);

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = 30;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + tax;

  const saveNewAddress = async () => {
    try {
      const { data } = await api.post('/addresses', newAddress);
      setAddresses([...addresses, data.address]);
      setSelectedAddress(data.address);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save address');
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select or add a delivery address');
      return;
    }
    setPlacing(true);
    try {
      if (paymentMethod === 'cod') {
        const { data } = await api.post('/orders', {
          deliveryAddress: selectedAddress,
          paymentMethod: 'cod',
        });
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate(`/orders/${data.order._id}`);
      } else {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          toast.error('Failed to load payment gateway. Please try again.');
          setPlacing(false);
          return;
        }

        const { data: rpData } = await api.post('/payments/create-order', { amount: total });

        const options = {
          key: rpData.key,
          amount: rpData.razorpayOrder.amount,
          currency: 'INR',
          name: 'Jammu-e-Khaas',
          description: 'Food order payment',
          order_id: rpData.razorpayOrder.id,
          handler: async (response) => {
            try {
              const { data: orderData } = await api.post('/orders', {
                deliveryAddress: selectedAddress,
                paymentMethod: 'razorpay',
              });

              await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.order._id,
              });

              dispatch(clearCart());
              toast.success('Payment successful! Order placed.');
              navigate(`/orders/${orderData.order._id}`);
            } catch (err) {
              toast.error('Payment verification failed. Please contact support.');
            }
          },
          prefill: { name: user?.name, email: user?.email, contact: user?.phone },
          theme: { color: '#7a1f2b' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-app py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <h1 className="font-display text-2xl font-bold">Checkout</h1>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Delivery Address</h3>
          <div className="space-y-3">
            {addresses.map((addr) => (
              <label key={addr._id} className={`block border rounded-lg p-3 cursor-pointer ${selectedAddress?._id === addr._id ? 'border-dogra-maroon' : 'border-slate-300 dark:border-slate-600'}`}>
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress?._id === addr._id}
                  onChange={() => setSelectedAddress(addr)}
                  className="mr-2"
                />
                <strong>{addr.label}</strong>: {addr.street}, {addr.city} - {addr.pincode} ({addr.phone})
              </label>
            ))}
          </div>

          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2 text-sm">Add a new address</h4>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Street" className="input-field col-span-2" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
              <input placeholder="Pincode" className="input-field" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
              <input placeholder="Phone" className="input-field" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            </div>
            <button onClick={saveNewAddress} className="btn-outline mt-3 text-sm">Save Address</button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Payment Method</h3>
          <label className="flex items-center gap-2 mb-2">
            <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} /> Pay Online (Razorpay)
          </label>
        </div>
      </div>

      <div className="card p-6 h-fit">
        <h3 className="font-display text-lg font-bold mb-4">Bill Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
        <button onClick={placeOrder} disabled={placing} className="btn-primary w-full mt-6">
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
