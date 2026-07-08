import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../redux/slices/restaurantSlice';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantList = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list, isLoading, total } = useSelector((state) => state.restaurants);
  const [sort, setSort] = useState('');

  useEffect(() => {
    dispatch(
      fetchRestaurants({
        search: searchParams.get('search') || undefined,
        sort: sort || undefined,
        limit: 24,
      })
    );
  }, [dispatch, searchParams, sort]);

  return (
    <div className="container-app py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl font-bold">Restaurants in Jammu ({total})</h1>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-auto">
          <option value="">Sort by: Relevance</option>
          <option value="rating">Rating</option>
          <option value="delivery_time">Delivery Time</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-slate-500">No restaurants found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((r) => (
            <RestaurantCard key={r._id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
