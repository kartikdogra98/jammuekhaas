import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import { addToCart } from '../redux/slices/cartSlice';

const FoodCard = ({ food }) => {
  const dispatch = useDispatch();
  const price = food.discountPrice > 0 ? food.discountPrice : food.price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card p-4 flex gap-4 items-center"
    >
      <img
        src={food.image?.url || 'https://placehold.co/100x100?text=Food'}
        alt={food.name}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-sm border ${food.isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <span className={`block w-1.5 h-1.5 rounded-full m-auto mt-0.5 ${food.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </span>
          <h4 className="font-semibold truncate">{food.name}</h4>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{food.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-dogra-maroon dark:text-dogra-gold">₹{price}</span>
          {food.discountPrice > 0 && (
            <span className="text-xs line-through text-slate-400">₹{food.price}</span>
          )}
        </div>
      </div>
      <button
        onClick={() => dispatch(addToCart({ foodId: food._id, quantity: 1 }))}
        className="btn-primary py-2 px-3 text-sm flex items-center gap-1 flex-shrink-0"
      >
        <FiPlus /> Add
      </button>
    </motion.div>
  );
};

export default FoodCard;
