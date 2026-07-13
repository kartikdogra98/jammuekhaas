import { FiStar, FiShoppingBag } from "react-icons/fi";

const TopRestaurants = ({ restaurants = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-6">
        🏆 Top Restaurants
      </h2>

      {restaurants.length === 0 ? (

        <div className="text-center py-10 text-gray-400">
          No restaurant data available.
        </div>

      ) : (

        restaurants.map((item, index) => (

          <div
            key={item._id || index}
            className="flex justify-between items-center py-4 border-b last:border-none"
          >

            <div>

              <h3 className="font-semibold text-lg">
                {item.restaurant?.name || item.name}
              </h3>

              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <FiShoppingBag />
                {item.orders || 0} Orders
              </p>

            </div>

            <div className="text-right">

              <p className="font-bold text-green-600">
                ₹{Number(item.revenue || 0).toLocaleString()}
              </p>

              {item.restaurant?.rating && (
                <div className="flex items-center justify-end gap-1 text-yellow-500 mt-1">
                  <FiStar />
                  {item.restaurant.rating}
                </div>
              )}

            </div>

          </div>

        ))

      )}

    </div>
  );
};

export default TopRestaurants;