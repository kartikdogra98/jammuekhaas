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
    <div className="text-slate-900 dark:text-white">

<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>

          <h1 className="text-2xl sm:text-3xl font-bold">
            Categories Management
          </h1>

          <p className="text-gray-500 dark:text-gray-300">
            Manage Food Categories
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-dogra-maroon hover:bg-dogra-maroon/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 transition"
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
        className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-gray-400 rounded-xl px-5 py-3 mb-8 focus:outline-none focus:ring-2 focus:ring-dogra-maroon"
      />

      {loading ? (
        <p className="text-center py-10 text-gray-500 dark:text-gray-300">
          Loading Categories...
        </p>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-transparent dark:border-slate-700">

          <div className="overflow-x-auto">

          <table className="w-full">

              <thead className="bg-slate-100 dark:bg-slate-700">

                <tr>

                  <th className="p-4 text-left text-slate-700 dark:text-white">
                    Image
                  </th>

                  <th className="text-left text-slate-700 dark:text-white">
                    Category
                  </th>

                  <th className="text-center text-slate-700 dark:text-white">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCategories.length === 0 ? (

                  <tr>

                    <td
                      colSpan="3"
                      className="text-center py-10 text-gray-500 dark:text-gray-300"
                    >
                      No Categories Found
                    </td>

                  </tr>

                ) : (

                  filteredCategories.map((category) => (

                    <tr
                      key={category._id}
                      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
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

                      <td className="font-semibold text-slate-900 dark:text-white">
                        {category.name}
                      </td>

                      <td>

                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() => deleteCategory(category._id)}
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