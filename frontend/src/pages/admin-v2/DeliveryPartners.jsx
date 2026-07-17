import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import DeliveryPartnerModal from "../../components/admin-v2/modals/DeliveryPartnerModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DeliveryPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data } = await api.get("/delivery-partners");
      setPartners(data.partners);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id) => {
    const result = await Swal.fire({
      title: "Delete Delivery Partner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/delivery-partners/${id}`);
      toast.success("Deleted Successfully");
      fetchPartners();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  return (
    <div className="text-slate-900 dark:text-white">

<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold">
            Delivery Partners
          </h1>

          <p className="text-gray-500 dark:text-gray-300">
            Manage Delivery Executives
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-dogra-maroon hover:bg-dogra-maroon/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 transition"
        >
          <FiPlus />
          Add Partner
        </button>

      </div>

      {loading ? (

        <p className="text-center py-10 text-gray-500 dark:text-gray-300">
          Loading Delivery Partners...
        </p>

      ) : (

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-transparent dark:border-slate-700">

          <div className="overflow-x-auto">

          <table className="min-w-[700px] w-full">

              <thead className="bg-slate-100 dark:bg-slate-700">

                <tr>

                  <th className="p-4 text-left">Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Phone</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {partners.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500 dark:text-gray-300"
                    >
                      No Delivery Partners Found
                    </td>

                  </tr>

                ) : (

                  partners.map((partner) => (

                    <tr
                      key={partner._id}
                      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >

                      <td className="p-4 font-medium">
                        {partner.name}
                      </td>

                      <td className="text-gray-700 dark:text-gray-200">
                        {partner.email}
                      </td>

                      <td className="text-gray-700 dark:text-gray-200">
                        {partner.phone}
                      </td>

                      <td>

                        {partner.isAvailable ? (

                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                            Online
                          </span>

                        ) : (

                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                            Offline
                          </span>

                        )}

                      </td>

                      <td className="font-semibold">
                        ⭐ {partner.rating || 0}
                      </td>

                      <td>

                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() => setEditingPartner(partner)}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() => deletePartner(partner._id)}
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
        <DeliveryPartnerModal
          onClose={() => setShowModal(false)}
          refreshPartners={fetchPartners}
        />
      )}

      {editingPartner && (
        <DeliveryPartnerModal
          partner={editingPartner}
          onClose={() => setEditingPartner(null)}
          refreshPartners={fetchPartners}
        />
      )}

    </div>
  );
};

export default DeliveryPartners;