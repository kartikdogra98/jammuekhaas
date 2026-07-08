import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiClock } from 'react-icons/fi';

const restaurantImages = {
  "Dogra Chicken Corner": "/images/restaurants/dogra-chicken-corner.jpg",
  "Jammu Zaika": "/images/restaurants/jammu-zaika.jpg",
  "Wazwan House": "/images/restaurants/wazwan-house.jpg",
  "Punjab Tadka": "/images/restaurants/punjab-tadka.jpg",
  "Kulcha Junction": "/images/restaurants/kulcha-junction.jpg",
  "Spice Route": "/images/restaurants/spice-route.jpg",
  "Sweet Cravings": "/images/restaurants/sweet-cravings.jpg",
  "Chai & Chill Café": "/images/restaurants/chai-and-chill.jpg",
};

const RestaurantCard = ({ restaurant }) => {
  console.log(restaurant.name, restaurant.image?.url);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Link to={`/restaurants/${restaurant._id}`} className="card block">
        <div className="relative h-40">
        <img
  src={
    restaurantImages[restaurant.name] ||
    "https://placehold.co/400x200?text=Restaurant"
  }
  alt={restaurant.name}
  className="w-full h-full object-cover"
/>

          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
              Currently Closed
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display font-semibold text-lg truncate">
            {restaurant.name}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
            {restaurant.cuisine?.join(', ')}
          </p>

          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <FiStar className="fill-current" />{" "}
              {restaurant.rating?.toFixed(1) || "New"}
            </span>

            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <FiClock /> {restaurant.avgDeliveryTime} min
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
    );
  };
  
  export default RestaurantCard;