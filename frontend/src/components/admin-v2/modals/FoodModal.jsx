import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const FoodModal = ({food,onClose,refreshFoods,}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    restaurant: food?.restaurant?._id || "",
    category: food?.category?._id || "",

    name: food?.name || "",
    description: food?.description || "",

    price: food?.price || "",

    isVeg: food?.isVeg ?? true,
    isAvailable: food?.isAvailable ?? true,

    image: null,
});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const restaurantRes = await api.get("/restaurants");
      const categoryRes = await api.get("/categories");

      setRestaurants(restaurantRes.data.restaurants);
      setCategories(categoryRes.data.categories);

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : files
          ? files[0]
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (food) {
        await api.put(`/foods/${food._id}`, formData);
    
        toast.success("Food Updated Successfully");
    } else {
        await api.post("/foods", formData);
    
        toast.success("Food Added Successfully");
    }

      toast.success("Food Added Successfully");

      refreshFoods();

      onClose();

    } catch (err) {
      console.log(err);
      toast.error("Failed to add food");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl">

        <div className="flex justify-between mb-6">

        <h2 className="text-3xl font-bold">
    {food ? "Edit Food" : "Add Food"}
</h2>

          <button onClick={onClose}>✖</button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >

          <select
            name="restaurant"
            value={form.restaurant}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          >
            <option value="">Restaurant</option>

            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          >
            <option value="">Category</option>

            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Food Name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-3 rounded-xl col-span-2"
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="col-span-2"
          />

          <label>
            <input
              type="checkbox"
              name="isVeg"
              checked={form.isVeg}
              onChange={handleChange}
            />
            Veg
          </label>

          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            Available
          </label>

          <button
            className="col-span-2 bg-dogra-maroon text-white py-3 rounded-xl"
          >
            Save Food
          </button>

        </form>

      </div>

    </div>
  );
};

export default FoodModal;