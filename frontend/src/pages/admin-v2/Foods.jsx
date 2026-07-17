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
    <div className="text-slate-900 dark:text-white">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold">
            Food Management
          </h1>

          <p className="text-gray-500 dark:text-gray-300">
            Manage all dishes
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-dogra-maroon hover:bg-dogra-maroon/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 transition"
        >
          <FiPlus />
          Add Food
        </button>

      </div>

      {/* Filters */}

      <div className="flex gap-4 mb-6 flex-wrap">

        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 placeholder:text-gray-400"
        />

        <select
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3"
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

        <p className="text-center py-10 text-gray-500 dark:text-gray-300">
          Loading Foods...
        </p>

      ) : (

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-transparent dark:border-slate-700">

          <div className="overflow-x-auto">

          <table className="min-w-[750px] w-full">

              <thead className="bg-slate-100 dark:bg-slate-700">

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

                {foods.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="text-center py-10 text-gray-500 dark:text-gray-300"
                    >
                      No Foods Found
                    </td>

                  </tr>

                ) : (

                  foods.map((food) => (

                    <tr
                      key={food._id}
                      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >

                      <td className="p-4">

                        <img
                          src={food.image?.url}
                          alt={food.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />

                      </td>

                      <td className="font-semibold">
                        {food.name}
                      </td>

                      <td className="text-gray-700 dark:text-gray-200">
                        {food.restaurant?.name}
                      </td>

                      <td className="text-gray-700 dark:text-gray-200">
                        {food.category?.name}
                      </td>

                      <td className="font-medium">
                        ₹ {food.price}
                      </td>

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
                          {food.isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </span>

                      </td>

                      <td>

                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() => setEditingFood(food)}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() => deleteFood(food._id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                          >
                            <FiTrash2 />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

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