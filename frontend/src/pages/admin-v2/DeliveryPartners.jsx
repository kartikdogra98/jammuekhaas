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
    <div>

      <div className="flex justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Delivery Partners
          </h1>

          <p className="text-gray-500">
            Manage Delivery Executives
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-dogra-maroon text-white px-6 py-3 rounded-xl flex gap-2 items-center"
        >
          <FiPlus />
          Add Partner
        </button>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {partners.map((partner) => (

                <tr key={partner._id} className="border-b">

                  <td>{partner.name}</td>

                  <td>{partner.email}</td>

                  <td>{partner.phone}</td>

                  <td>

                    {partner.isAvailable ? (
                      <span className="text-green-600">
                        Online
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Offline
                      </span>
                    )}

                  </td>

                  <td>

                    ⭐ {partner.rating || 0}

                  </td>

                  <td>

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => setEditingPartner(partner)}
                      >
                        <FiEdit />
                      </button>

                      <button
                        onClick={() => deletePartner(partner._id)}
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