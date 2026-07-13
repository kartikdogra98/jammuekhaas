const ViewRestaurantModal = ({ restaurant, onClose }) => {
    if (!restaurant) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  
        <div className="bg-white rounded-2xl w-[700px] p-8">
  
          <div className="flex justify-between items-center">
  
            <h2 className="text-3xl font-bold">
              {restaurant.name}
            </h2>
  
            <button
              onClick={onClose}
              className="text-2xl"
            >
              ✖
            </button>
  
          </div>
  
          <img
            src={restaurant.image?.url}
            className="w-full h-72 object-cover rounded-xl mt-5"
          />
  
          <div className="grid grid-cols-2 gap-6 mt-8">
  
            <div>
              <h3 className="font-bold">Cuisine</h3>
              <p>{restaurant.cuisine.join(", ")}</p>
            </div>
  
            <div>
              <h3 className="font-bold">Phone</h3>
              <p>{restaurant.phone}</p>
            </div>
  
            <div>
              <h3 className="font-bold">Rating</h3>
              <p>⭐ {restaurant.rating}</p>
            </div>
  
            <div>
              <h3 className="font-bold">Delivery Fee</h3>
              <p>₹{restaurant.deliveryFee}</p>
            </div>
  
            <div className="col-span-2">
              <h3 className="font-bold">Description</h3>
              <p>{restaurant.description}</p>
            </div>
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default ViewRestaurantModal;