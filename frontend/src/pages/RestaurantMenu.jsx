import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar } from 'react-icons/fi';
import { fetchRestaurantById } from '../redux/slices/restaurantSlice';
import { addToCart } from '../redux/slices/cartSlice';
import FoodCard from '../components/FoodCard';
import api from '../api/axios';

const RestaurantMenu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, currentMenu, isLoading } = useSelector((state) => state.restaurants);
  const [activeFood, setActiveFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (current?._id) {
      api.get(`/reviews?restaurant=${current._id}`).then((res) => setReviews(res.data.reviews)).catch(() => {});
    }
  }, [current]);

  const menu = vegOnly ? currentMenu.filter((f) => f.isVeg) : currentMenu;
  const grouped = menu.reduce((acc, food) => {
    const catName = food.category?.name || 'Other';
    acc[catName] = acc[catName] || [];
    acc[catName].push(food);
    return acc;
  }, {});

  if (isLoading || !current) return <div className="container-app py-10">Loading menu...</div>;

  return (
    <div>
      <div className="relative h-56 md:h-72">
        <img src={current.image?.url || 'https://placehold.co/1200x300?text=Restaurant'} alt={current.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container-app pb-6 text-white">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold">{current.name}</h1>
            <p className="text-white/90">{current.cuisine?.join(', ')} • {current.address?.city}</p>
            <p className="flex items-center gap-1 mt-1"><FiStar className="fill-current text-dogra-gold" /> {current.rating?.toFixed(1) || 'New'} ({current.numReviews} reviews)</p>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} className="w-4 h-4" />
          <span className="font-medium">Show Veg Only</span>
        </label>

        {Object.keys(grouped).length === 0 ? (
          <p className="text-slate-500">No menu items available right now.</p>
        ) : (
          Object.entries(grouped).map(([catName, foods]) => (
            <div key={catName} className="mb-8">
              <h2 className="font-display text-xl font-semibold mb-4">{catName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {foods.map((food) => (
                  <div key={food._id} onClick={() => setActiveFood(food)} className="cursor-pointer">
                    <FoodCard food={food} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-slate-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="card p-4">
                  <div className="flex items-center gap-2 font-medium">
                    <span>{rev.user?.name}</span>
                    <span className="flex items-center gap-1 text-dogra-gold"><FiStar className="fill-current" /> {rev.rating}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveFood(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card max-w-md w-full p-6 relative"
            >
              <button onClick={() => setActiveFood(null)} className="absolute top-4 right-4"><FiX /></button>
              <img
                src={activeFood.image?.url || 'https://placehold.co/400x250?text=Food'}
                alt={activeFood.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="font-display text-xl font-bold">{activeFood.name}</h3>
              <p className="text-slate-500 mt-1">{activeFood.description}</p>
              <p className="font-bold text-dogra-maroon dark:text-dogra-gold mt-3 text-lg">
                ₹{activeFood.discountPrice > 0 ? activeFood.discountPrice : activeFood.price}
              </p>
              <button
                onClick={() => {
                  dispatch(addToCart({ foodId: activeFood._id, quantity: 1 }));
                  setActiveFood(null);
                }}
                className="btn-primary w-full mt-4"
              >
                Add to Cart
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantMenu;
