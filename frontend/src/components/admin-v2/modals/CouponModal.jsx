import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const CouponModal = ({
  coupon,
  onClose,
  refreshCoupons,
}) => {

  const [form, setForm] = useState({
    code: coupon?.code || "",
    description: coupon?.description || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || "",
    maxDiscount: coupon?.maxDiscount || "",
    minOrderAmount: coupon?.minOrderAmount || "",
    usageLimit: coupon?.usageLimit || "",
    expiresAt: coupon?.expiresAt
      ? coupon.expiresAt.slice(0, 10)
      : "",
    isActive: coupon?.isActive ?? true,
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

      if (coupon) {

        await api.put(`/coupons/${coupon._id}`, form);

        toast.success("Coupon Updated");

      } else {

        await api.post("/coupons", form);

        toast.success("Coupon Created");

      }

      refreshCoupons();

      onClose();

    } catch (err) {

      console.log(err);

      toast.error("Something went wrong");

    }
  };

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-8 w-[700px]">

        <div className="flex justify-between mb-6">

          <h2 className="text-2xl font-bold">

            {coupon ? "Edit Coupon" : "Add Coupon"}

          </h2>

          <button onClick={onClose}>
            ✖
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >

          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Coupon Code"
            className="border rounded-xl p-3"
          />

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border rounded-xl p-3"
          />

          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="border rounded-xl p-3"
          >
            <option value="percentage">
              Percentage
            </option>

            <option value="flat">
              Flat
            </option>

          </select>

          <input
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            placeholder="Discount"
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            name="maxDiscount"
            value={form.maxDiscount}
            onChange={handleChange}
            placeholder="Max Discount"
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            name="minOrderAmount"
            value={form.minOrderAmount}
            onChange={handleChange}
            placeholder="Minimum Order"
            className="border rounded-xl p-3"
          />

          <input
            type="number"
            name="usageLimit"
            value={form.usageLimit}
            onChange={handleChange}
            placeholder="Usage Limit"
            className="border rounded-xl p-3"
          />

          <input
            type="date"
            name="expiresAt"
            value={form.expiresAt}
            onChange={handleChange}
            className="border rounded-xl p-3"
          />

          <label className="flex items-center gap-2 col-span-2">

            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />

            Active Coupon

          </label>

          <button
            className="bg-dogra-maroon text-white py-3 rounded-xl col-span-2"
          >
            Save Coupon
          </button>

        </form>

      </div>

    </div>

  );

};

export default CouponModal;