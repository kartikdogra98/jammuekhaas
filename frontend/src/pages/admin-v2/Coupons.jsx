import { useEffect, useState } from "react";
import api from "../../api/axios";
import CouponModal from "../../components/admin-v2/modals/CouponModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data.coupons);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    const result = await Swal.fire({
      title: "Delete Coupon?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/coupons/${id}`);

      toast.success("Coupon Deleted");

      fetchCoupons();
    } catch (err) {
      console.log(err);

      toast.error("Delete Failed");
    }
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(search.toLowerCase()) ||
      coupon.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-slate-900 dark:text-white">

<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold">
            Coupons Management
          </h1>

          <p className="text-gray-500 dark:text-gray-300">
            Manage discount coupons
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-dogra-maroon hover:bg-dogra-maroon/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 transition"
        >
          <FiPlus />
          Add Coupon
        </button>

      </div>

      <input
        type="text"
        placeholder="Search Coupon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-gray-400 rounded-xl px-5 py-3 mb-8 focus:outline-none focus:ring-2 focus:ring-dogra-maroon"
      />

      {loading ? (
        <p className="text-center py-10 text-gray-500 dark:text-gray-300">
          Loading Coupons...
        </p>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-transparent dark:border-slate-700">

          <div className="overflow-x-auto">

          <table className="min-w-[800px] w-full">

              <thead className="bg-slate-100 dark:bg-slate-700">

                <tr>

                  <th className="p-4 text-left">Code</th>

                  <th>Description</th>

                  <th>Type</th>

                  <th>Discount</th>

                  <th>Min Order</th>

                  <th>Used</th>

                  <th>Expires</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredCoupons.length === 0 ? (

                  <tr>

                    <td
                      colSpan="9"
                      className="text-center py-10 text-gray-500 dark:text-gray-300"
                    >
                      No Coupons Found
                    </td>

                  </tr>

                ) : (

                  filteredCoupons.map((coupon) => (

                    <tr
                      key={coupon._id}
                      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >

                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {coupon.code}
                      </td>

                      <td className="text-slate-700 dark:text-gray-200">
                        {coupon.description}
                      </td>

                      <td>

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            coupon.discountType === "percentage"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {coupon.discountType}
                        </span>

                      </td>

                      <td className="text-slate-700 dark:text-gray-200">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>

                      <td className="text-slate-700 dark:text-gray-200">
                        ₹{coupon.minOrderAmount}
                      </td>

                      <td className="text-slate-700 dark:text-gray-200">
                        {coupon.usedCount}/{coupon.usageLimit}
                      </td>

                      <td className="text-slate-700 dark:text-gray-200">
                        {new Date(coupon.expiresAt).toLocaleDateString()}
                      </td>

                      <td>

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            coupon.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>

                      </td>

                      <td>

                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() => setEditingCoupon(coupon)}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() => deleteCoupon(coupon._id)}
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

      {showModal && (
        <CouponModal
          onClose={() => setShowModal(false)}
          refreshCoupons={fetchCoupons}
        />
      )}

      {editingCoupon && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          refreshCoupons={fetchCoupons}
        />
      )}

    </div>
  );
};

export default Coupons;