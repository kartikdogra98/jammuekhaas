import { useEffect, useState } from "react";
import RestaurantModal from "../../components/admin-v2/modals/RestaurantModal";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ViewRestaurantModal from "../../components/admin-v2/modals/ViewRestaurantModal";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
const Restaurants = () => {

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
  
    useEffect(() => {
      fetchRestaurants();
    }, []);
  
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get("/restaurants");
  
        setRestaurants(data.restaurants);
  
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const deleteRestaurant = async (id) => {
      const result = await Swal.fire({
        title: "Delete Restaurant?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Delete",
      });
    
      if (!result.isConfirmed) return;
    
      try {
        await api.delete(`/restaurants/${id}`);
    
        toast.success("Restaurant Deleted Successfully");
    
        fetchRestaurants();
    
      } catch (error) {
        console.error(error);
    
        toast.error("Failed to delete restaurant");
      }
    };
  
    return (
      <div>
        <div className="flex justify-between items-center mb-8">

<div>
  <h1 className="text-3xl font-bold">
    Restaurant Management
  </h1>

  <p className="text-gray-500">
    Manage all restaurants
  </p>
</div>

<button
  onClick={() => setShowModal(true)}
  className="bg-dogra-maroon text-white px-6 py-3 rounded-xl hover:bg-red-900 transition"
>
  + Add Restaurant
</button>

</div>
<input
  type="text"
  placeholder="Search restaurant..."
  className="w-full border rounded-xl px-5 py-3 mb-8"
/>
  
        {/* Keep your existing heading and search bar */}
  
        {loading ? (
  <p>Loading...</p>
) : (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Image</th>
            <th className="text-left">Restaurant</th>
            <th className="text-left">Cuisine</th>
            <th className="text-left">Rating</th>
            <th className="text-left">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {restaurants.map((restaurant) => (

            <tr key={restaurant._id} className="border-b">

              <td className="p-4">
              <img
  src={restaurant.image.url}
  alt={restaurant.name}
  className="w-16 h-16 rounded-xl object-cover"
/>
              </td>

              <td>{restaurant.name}</td>

              <td>{restaurant.cuisine.join(", ")}</td>

              <td>⭐ {restaurant.rating}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full ${
                    restaurant.isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {restaurant.isApproved ? "Approved" : "Pending"}
                </span>
              </td>

              <td>
                <div className="flex justify-center gap-3">

                <button onClick={() => setSelectedRestaurant(restaurant)} className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <FiEye />
                    </button>

                    <button onClick={() => setEditingRestaurant(restaurant)} className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
                      <FiEdit />
                    </button>

                    <button onClick={() => deleteRestaurant(restaurant._id)} className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">
                            <FiTrash2 />
                    </button>

                </div>
              </td>

            </tr>

          ))}

        </tbody>

      </table>
      {showModal && (
        <RestaurantModal
          onClose={() => setShowModal(false)}
          refreshRestaurants={fetchRestaurants}
        />
      )}
      {editingRestaurant && (
  <RestaurantModal
    restaurant={editingRestaurant}
    onClose={() => setEditingRestaurant(null)}
    refreshRestaurants={fetchRestaurants}
  />
)}

      {selectedRestaurant && (
        <ViewRestaurantModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

    </div>

  </div>
)}

      </div>
    );
};

export default Restaurants;