import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
const RestaurantModal = ({
  restaurant,
  onClose,
  refreshRestaurants,
}) => {
  const [form, setForm] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  
    name: restaurant?.name || "",
    description: restaurant?.description || "",
    cuisine: restaurant?.cuisine?.[0] || "",
  
    street: restaurant?.address?.street || "",
    city: restaurant?.address?.city || "Jammu",
    state: restaurant?.address?.state || "Jammu & Kashmir",
    pincode: restaurant?.address?.pincode || "",
  
    phone: restaurant?.phone || "",
  
    openingTime: restaurant?.openingTime || "09:00",
    closingTime: restaurant?.closingTime || "23:00",
  
    deliveryFee: restaurant?.deliveryFee || 30,
    avgDeliveryTime: restaurant?.avgDeliveryTime || 30,
    minOrderAmount: restaurant?.minOrderAmount || 100,
  
    image: null,
  });

      const handleChange = (e) => {

        const { name, value, files } = e.target;
      
        setForm({
          ...form,
          [name]: files ? files[0] : value,
        });
      
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const formData = new FormData();
          formData.append("ownerName", form.ownerName);
          formData.append("ownerEmail", form.ownerEmail);
          formData.append("ownerPassword", form.ownerPassword);
          formData.append("name", form.name);
          formData.append("description", form.description);
      
          formData.append(
            "address",
            JSON.stringify({
              street: form.street,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
            })
          );
      
          formData.append(
            "cuisine",
            JSON.stringify([form.cuisine])
          );
      
          formData.append("phone", form.phone);
          formData.append("openingTime", form.openingTime);
          formData.append("closingTime", form.closingTime);
          formData.append("deliveryFee", form.deliveryFee);
          formData.append("avgDeliveryTime", form.avgDeliveryTime);
          formData.append("minOrderAmount", form.minOrderAmount);
      
          if (form.image) {
            formData.append("image", form.image);
          }
      
          let response;

if (restaurant) {
  response = await api.put(
    `/restaurants/${restaurant._id}`,
    formData
  );
} else {
  response = await api.post(
    "/admin/restaurants",
    formData
  );
}

const { data } = response;
toast.success(
  restaurant
    ? "Restaurant Updated Successfully"
    : "Restaurant Added Successfully"
);
      
          console.log(data);
      
          refreshRestaurants();
      
          onClose();
      
        } catch (err) {
          console.error(err.response?.data || err.message);
        }
      };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl">

        <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
  {restaurant ? "Edit Restaurant" : "Add Restaurant"}
</h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✖
          </button>

        </div>

        <form
  onSubmit={handleSubmit}
  className="grid grid-cols-2 gap-4"
>
<input
  name="ownerName"
  placeholder="Owner Name"
  value={form.ownerName}
  onChange={handleChange}
  className="border rounded-lg p-3"
/>

<input
  name="ownerEmail"
  type="email"
  placeholder="Owner Email"
  value={form.ownerEmail}
  onChange={handleChange}
  className="border rounded-lg p-3"
/>

<input
  name="ownerPassword"
  type="password"
  placeholder="Owner Password"
  value={form.ownerPassword}
  onChange={handleChange}
  className="border rounded-lg p-3 col-span-2"
/>
<input
name="name"
value={form.name}
placeholder="Restaurant Name"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<input
name="phone"
value={form.phone}
placeholder="Phone"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<textarea
name="description"
value={form.description}
placeholder="Description"
onChange={handleChange}
className="border rounded-lg p-3 col-span-2"
/>

<input
name="street"
placeholder="Street"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<input
name="pincode"
placeholder="Pincode"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<select
name="cuisine"
value={form.cuisine}
onChange={handleChange}
className="border rounded-lg p-3"
>

<option value="">Cuisine</option>

<option>Dogra Special</option>

<option>North Indian</option>

<option>Kashmiri Wazwan</option>

<option>Street Food</option>

<option>Desserts</option>

<option>Beverages</option>

</select>

<input
type="file"
name="image"
accept="image/*"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<input
type="time"
name="openingTime"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<input
type="time"
name="closingTime"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<input
type="number"
name="deliveryFee"
placeholder="Delivery Fee"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<input
type="number"
name="avgDeliveryTime"
placeholder="Delivery Time"
onChange={handleChange}
className="border rounded-lg p-3"
/>

<input
type="number"
name="minOrderAmount"
placeholder="Minimum Order"
onChange={handleChange}
className="border rounded-lg p-3 col-span-2"
/>

<button
className="bg-dogra-maroon text-white rounded-lg py-3 col-span-2"
>

Save Restaurant

</button>

</form>

      </div>

    </div>
  );
};

export default RestaurantModal;