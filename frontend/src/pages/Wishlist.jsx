import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ foods: [], restaurants: [] });

  useEffect(() => {
    api.get('/wishlist').then((res) => setWishlist(res.data.wishlist));
  }, []);

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-2xl font-bold mb-6">My Wishlist</h1>

      <h2 className="font-semibold text-lg mb-3">Favourite Restaurants</h2>
      {wishlist.restaurants?.length === 0 ? (
        <p className="text-slate-500 mb-6">No favourite restaurants yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {wishlist.restaurants?.map((r) => <RestaurantCard key={r._id} restaurant={r} />)}
        </div>
      )}

      <h2 className="font-semibold text-lg mb-3">Favourite Dishes</h2>
      {wishlist.foods?.length === 0 ? (
        <p className="text-slate-500">No favourite dishes yet. <Link to="/restaurants" className="text-dogra-maroon">Browse restaurants</Link></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlist.foods?.map((f) => <FoodCard key={f._id} food={f} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
