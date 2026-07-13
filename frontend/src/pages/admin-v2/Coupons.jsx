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
    <div>

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Coupons Management
          </h1>

          <p className="text-gray-500">
            Manage discount coupons
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-dogra-maroon text-white px-6 py-3 rounded-xl flex items-center gap-2"
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
        className="w-full border rounded-xl px-5 py-3 mb-8"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

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

                {filteredCoupons.map((coupon) => (

                  <tr key={coupon._id} className="border-b">

                    <td className="p-4 font-bold">
                      {coupon.code}
                    </td>

                    <td>{coupon.description}</td>

                    <td>

                      <span
                        className={`px-3 py-1 rounded-full ${
                          coupon.discountType === "percentage"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {coupon.discountType}
                      </span>

                    </td>

                    <td>
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>

                    <td>
                      ₹{coupon.minOrderAmount}
                    </td>

                    <td>
                      {coupon.usedCount}/{coupon.usageLimit}
                    </td>

                    <td>
                      {new Date(
                        coupon.expiresAt
                      ).toLocaleDateString()}
                    </td>

                    <td>

                      <span
                        className={`px-3 py-1 rounded-full ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {coupon.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td>

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            setEditingCoupon(coupon)
                          }
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        >
                          <FiEdit />
                        </button>

                        <button
                          onClick={() =>
                            deleteCoupon(coupon._id)
                          }
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