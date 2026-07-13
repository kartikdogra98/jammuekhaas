import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const DeliveryPartnerModal = ({
  partner,
  onClose,
  refreshPartners,
}) => {
  const [form, setForm] = useState({
    name: partner?.name || "",
    email: partner?.email || "",
    password: "",
    phone: partner?.phone || "",
    vehicleNumber: partner?.vehicleNumber || "",
    licenseNumber: partner?.licenseNumber || "",
    isAvailable: partner?.isAvailable || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (partner) {

        await api.put(
          `/delivery-partners/${partner._id}`,
          form
        );

        toast.success("Delivery Partner Updated");

      } else {

        await api.post(
          "/delivery-partners",
          form
        );

        toast.success("Delivery Partner Added");

      }

      refreshPartners();

      onClose();

    } catch (err) {

      console.log(err);

      toast.error("Something went wrong");

    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-xl p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {partner ? "Edit Partner" : "Add Delivery Partner"}
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
          className="grid gap-4"
        >

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          {!partner && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border rounded-lg p-3"
              required
            />
          )}

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            name="licenseNumber"
            placeholder="License Number"
            value={form.licenseNumber}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
            />

            Available for Delivery

          </label>

          <button
            className="bg-dogra-maroon text-white py-3 rounded-lg"
          >
            Save Partner
          </button>

        </form>

      </div>

    </div>
  );
};

export default DeliveryPartnerModal;