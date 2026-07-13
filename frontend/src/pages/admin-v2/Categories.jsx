import { useEffect, useState } from "react";
import api from "../../api/axios";
import CategoryModal from "../../components/admin-v2/modals/CategoryModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");

      setCategories(data.categories);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/categories/${id}`);

      toast.success("Category Deleted");

      fetchCategories();
    } catch (err) {
      console.log(err);

      toast.error("Delete Failed");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Categories Management
          </h1>

          <p className="text-gray-500">
            Manage Food Categories
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-dogra-maroon text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <FiPlus />
          Add Category
        </button>

      </div>

      <input
        type="text"
        placeholder="Search Category..."
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

                  <th className="p-4 text-left">Image</th>

                  <th className="text-left">Category</th>

                  <th className="text-center">Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredCategories.map((category) => (

                  <tr
                    key={category._id}
                    className="border-b"
                  >

                    <td className="p-4">

                      <img
                        src={
                          category.image?.url ||
                          "https://placehold.co/80x80?text=Category"
                        }
                        alt={category.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />

                    </td>

                    <td className="font-semibold">
                      {category.name}
                    </td>

                    <td>

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                        >
                          <FiEdit />
                        </button>

                        <button
                          onClick={() => deleteCategory(category._id)}
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
        <CategoryModal
          onClose={() => setShowModal(false)}
          refreshCategories={fetchCategories}
        />
      )}

      {editingCategory && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          refreshCategories={fetchCategories}
        />
      )}

    </div>
  );
};

export default Categories;