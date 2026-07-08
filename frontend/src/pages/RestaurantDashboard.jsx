import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const RestaurantDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('menu');
  const [restaurantForm, setRestaurantForm] = useState({ name: '', description: '', cuisine: '', street: '', pincode: '' });
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [restaurantImagePreview, setRestaurantImagePreview] = useState('');
  const [foodForm, setFoodForm] = useState({ name: '', price: '', category: '', description: '', isVeg: true });
  const [foodImage, setFoodImage] = useState(null);
  const [foodImagePreview, setFoodImagePreview] = useState('');
  const [categories, setCategories] = useState([]);

  const handleRestaurantImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestaurantImage(file);
    setRestaurantImagePreview(URL.createObjectURL(file));
  };

  const handleFoodImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoodImage(file);
    setFoodImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    api.get('/restaurants/my/list').then((res) => {
      setRestaurants(res.data.restaurants);
      if (res.data.restaurants[0]) setActiveRestaurant(res.data.restaurants[0]);
    });
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (!activeRestaurant) return;
    api.get(`/restaurants/${activeRestaurant._id}`).then((res) => setMenu(res.data.menu));
    api.get(`/orders/restaurant/${activeRestaurant._id}`).then((res) => setOrders(res.data.orders));
  }, [activeRestaurant]);

  const createRestaurant = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', restaurantForm.name);
      formData.append('description', restaurantForm.description);
      formData.append(
        'cuisine',
        JSON.stringify(restaurantForm.cuisine.split(',').map((c) => c.trim()).filter(Boolean))
      );
      formData.append('address', JSON.stringify({ street: restaurantForm.street, pincode: restaurantForm.pincode }));
      if (restaurantImage) formData.append('image', restaurantImage);

      const { data } = await api.post('/restaurants', formData);
      setRestaurants([...restaurants, data.restaurant]);
      setActiveRestaurant(data.restaurant);
      toast.success('Restaurant created! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create restaurant');
    }
  };

  const addFood = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', foodForm.name);
      formData.append('description', foodForm.description);
      formData.append('price', foodForm.price);
      formData.append('category', foodForm.category);
      formData.append('isVeg', foodForm.isVeg);
      formData.append('restaurant', activeRestaurant._id);
      if (foodImage) formData.append('image', foodImage);

      const { data } = await api.post('/foods', formData);
      setMenu([...menu, data.food]);
      toast.success('Food item added');
      setFoodForm({ name: '', price: '', category: '', description: '', isVeg: true });
      setFoodImage(null);
      setFoodImagePreview('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add food item');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    api.get(`/orders/restaurant/${activeRestaurant._id}`).then((res) => setOrders(res.data.orders));
  };

  if (restaurants.length === 0) {
    return (
      <div className="container-app py-10 max-w-md">
        <h1 className="font-display text-2xl font-bold mb-6">Set Up Your Restaurant</h1>
        <form onSubmit={createRestaurant} className="card p-6 space-y-3">
          <input required placeholder="Restaurant Name" className="input-field" value={restaurantForm.name} onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })} />
          <textarea placeholder="Description" className="input-field" value={restaurantForm.description} onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })} />
          <input placeholder="Cuisine (comma separated)" className="input-field" value={restaurantForm.cuisine} onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })} />
          <input required placeholder="Street Address" className="input-field" value={restaurantForm.street} onChange={(e) => setRestaurantForm({ ...restaurantForm, street: e.target.value })} />
          <input placeholder="Pincode" className="input-field" value={restaurantForm.pincode} onChange={(e) => setRestaurantForm({ ...restaurantForm, pincode: e.target.value })} />

          <div>
            <label className="text-sm font-medium block mb-1">Restaurant Photo</label>
            {restaurantImagePreview && (
              <img
                src={restaurantImagePreview}
                alt="Restaurant preview"
                className="w-full h-32 sm:h-40 object-cover rounded-xl mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleRestaurantImageChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-dogra-maroon file:text-white hover:file:bg-dogra-maroonDark file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-slate-400 mt-1">Optional, but shows up on your restaurant's card and menu page.</p>
          </div>

          <button type="submit" className="btn-primary w-full">Create Restaurant</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">{activeRestaurant?.name} Dashboard</h1>
        <span className={`text-xs px-3 py-1 rounded-full ${activeRestaurant?.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {activeRestaurant?.isApproved ? 'Approved' : 'Pending Approval'}
        </span>
      </div>

      <div className="flex gap-4 mb-8 border-b">
        {['menu', 'orders'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`pb-3 px-2 capitalize font-medium ${tab === t ? 'border-b-2 border-dogra-maroon text-dogra-maroon' : 'text-slate-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'menu' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Add Menu Item</h3>
            <form onSubmit={addFood} className="space-y-3">
              <input required placeholder="Food Name" className="input-field" value={foodForm.name} onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })} />
              <textarea placeholder="Description" className="input-field" value={foodForm.description} onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })} />
              <input required type="number" placeholder="Price (₹)" className="input-field" value={foodForm.price} onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })} />
              <select required className="input-field" value={foodForm.category} onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={foodForm.isVeg} onChange={(e) => setFoodForm({ ...foodForm, isVeg: e.target.checked })} /> Vegetarian
              </label>

              <div>
                <label className="text-sm font-medium block mb-1">Food Photo</label>
                {foodImagePreview && (
                  <img
                    src={foodImagePreview}
                    alt="Food preview"
                    className="w-full h-32 sm:h-36 object-cover rounded-xl mb-2"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFoodImageChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-dogra-maroon file:text-white hover:file:bg-dogra-maroonDark file:cursor-pointer cursor-pointer"
                />
                <p className="text-xs text-slate-400 mt-1">Optional, but customers respond much better to dishes with a photo.</p>
              </div>

              <button type="submit" className="btn-primary w-full">Add Item</button>
            </form>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Current Menu ({menu.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {menu.map((f) => (
                <div key={f._id} className="flex items-center gap-3 justify-between border-b pb-2 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={f.image?.url || 'https://placehold.co/40x40?text=🍽'}
                      alt={f.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="flex-shrink-0">₹{f.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-slate-500">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="card p-5 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <p className="font-semibold">#{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">{order.user?.name} • ₹{order.total.toFixed(2)}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="input-field w-auto"
                >
                  {['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
