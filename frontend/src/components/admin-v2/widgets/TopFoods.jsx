const TopFoods = ({ foods = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-6">
        🔥 Top Selling Foods
      </h2>

      {foods.length === 0 ? (

        <div className="text-center py-10 text-gray-400">
          No food sales available yet.
        </div>

      ) : (

        foods.map((food) => (

          <div
            key={food._id}
            className="flex justify-between items-center py-4 border-b last:border-none"
          >

            <div className="flex items-center gap-4">

              {food.image?.url ? (

                <img
                  src={food.image.url}
                  alt={food.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />

              ) : (

                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                  🍽️
                </div>

              )}

              <div>

                <h3 className="font-semibold">
                  {food.name}
                </h3>

                <p className="text-sm text-gray-500">
                  ₹{food.price}
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-dogra-maroon font-bold text-lg">
                {food.totalOrders}
              </p>

              <p className="text-xs text-gray-500">
                Orders
              </p>

            </div>

          </div>

        ))

      )}

    </div>
  );
};

export default TopFoods;