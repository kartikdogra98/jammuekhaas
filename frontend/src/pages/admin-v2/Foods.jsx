import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import FoodModal from "../../components/admin-v2/modals/FoodModal";

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const [editingFood, setEditingFood] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, [search, selectedRestaurant]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const { data } = await api.get("/restaurants");
      setRestaurants(data.restaurants);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/foods", {
        params: {
          search,
          restaurant: selectedRestaurant,
        },
      });

      setFoods(data.foods);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFood = async (id) => {
    const result = await Swal.fire({
      title: "Delete Food?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/foods/${id}`);

      toast.success("Food Deleted Successfully");

      fetchFoods();
    } catch (err) {
      console.log(err);

      toast.error("Failed to delete food");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Food Management</h1>

          <p className="text-gray-500">Manage all dishes</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-dogra-maroon text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <FiPlus />
          Add Food
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-3"
        />

        <select
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">All Restaurants</option>

          {restaurants.map((restaurant) => (
            <option key={restaurant._id} value={restaurant._id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4">Image</th>
                  <th>Name</th>
                  <th>Restaurant</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Veg</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {foods.map((food) => (
                  <tr key={food._id} className="border-b">

                    <td className="p-4">
                      <img
                        src={food.image?.url}
                        alt={food.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    </td>

                    <td>{food.name}</td>

                    <td>{food.restaurant?.name}</td>

                    <td>{food.category?.name}</td>

                    <td>₹ {food.price}</td>

                    <td>
                      {food.isVeg ? (
                        <span className="text-green-600 font-semibold">
                          🟢 Veg
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          🔴 Non Veg
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          food.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-center gap-3">

                      <button onClick={() => setEditingFood(food)} className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
                          <FiEdit />
                      </button>

                        <button
                          onClick={() => deleteFood(food._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <FiTrash2 />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <FoodModal
          onClose={() => setShowModal(false)}
          refreshFoods={fetchFoods}
        />
      )}
      {editingFood && (
        <FoodModal
          food={editingFood}
          onClose={() => setEditingFood(null)}
          refreshFoods={fetchFoods}
        />
      )}
    </div>
  );
};

export default Foods;