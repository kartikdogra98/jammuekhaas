import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { fetchRestaurants } from '../redux/slices/restaurantSlice';
import RestaurantCard from '../components/RestaurantCard';
import api from '../api/axios';

const Home = () => {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector((state) => state.restaurants);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants({ limit: 8 }));
    api.get('/categories').then((res) => setCategories(res.data.categories)).catch(() => {});
  }, [dispatch]);

  const categoryImages = {
    "Dogra Special": "/images/categories/dogra-special.jpg",
    "Kashmiri Wazwan": "/images/categories/wazwan.jpg",
    "North Indian": "/images/categories/north-indian.jpg",
    "Street Food": "/images/categories/street-food.jpg",
    "Desserts": "/images/categories/desserts.jpg",
    "Beverages": "/images/categories/beverages.jpg",
  };

  return (
    <div>
      {/* Hero */}
<section
  className="relative overflow-hidden bg-cover bg-center bg-no-repeat text-white"
  style={{
    backgroundImage: "url('/images/background.png')", // Change to background.jpg if needed
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  <div className="container-app pt-20 pb-32 md:pt-24 md:pb-40 relative z-10 -translate-y-6">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display text-4xl md:text-6xl font-extrabold max-w-2xl leading-tight"
    >
      Authentic Dogra Flavours,{" "}
      <span className="text-dogra-gold">Delivered Hot</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-4 text-lg text-white/90 max-w-xl"
    >
      Order from Jammu's finest restaurants — from Rajma Rice to Kaladi Kulcha
      — straight to your door.
    </motion.p>

    <motion.form
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  onSubmit={(e) => {
    e.preventDefault();
    window.location.href = `/restaurants?search=${encodeURIComponent(search)}`;
  }}
  className="mt-8 flex w-full max-w-xl mx-auto bg-white/95 backdrop-blur rounded-xl shadow-2xl overflow-hidden"
>
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search restaurants or dishes..."
    className="flex-1 h-12 px-4 text-dogra-slate focus:outline-none text-sm md:text-base"
  />

  <button
    type="submit"
    className="bg-dogra-gold text-dogra-slate w-12 h-12 md:w-auto md:px-6 flex items-center justify-center font-semibold hover:bg-yellow-400 transition"
  >
    <FiSearch className="text-xl" />

    <span className="hidden md:inline ml-2">
      Search
    </span>
  </button>
</motion.form>
  </div>
</section>

      {/* Categories */}
      <section className="container-app py-12">
        <h2 className="font-display text-2xl font-bold mb-6">Explore Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/restaurants?category=${cat._id}`}
              className="card p-5 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
            <img src={categoryImages[cat.name] || "/images/categories/default.jpg"} alt={cat.name} className="w-20 h-20 mx-auto rounded-full object-cover shadow-md"
            />
            <p className="text-sm font-medium truncate">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Restaurants */}
      <section className="container-app py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Popular Restaurants Near You</h2>
          <Link to="/restaurants" className="text-dogra-maroon dark:text-dogra-gold font-medium flex items-center gap-1">
            View all <FiArrowRight />
          </Link>
        </div>
        {isLoading ? (
          <p>Loading restaurants...</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500">No restaurants available yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
