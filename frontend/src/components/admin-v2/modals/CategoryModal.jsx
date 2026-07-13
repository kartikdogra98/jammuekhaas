import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const CategoryModal = ({
  category,
  onClose,
  refreshCategories,
}) => {

  const [form, setForm] = useState({
    name: category?.name || "",
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

      formData.append("name", form.name);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (category) {

        await api.put(
          `/categories/${category._id}`,
          formData
        );

        toast.success("Category Updated");

      } else {

        await api.post(
          "/categories",
          formData
        );

        toast.success("Category Added");

      }

      refreshCategories();

      onClose();

    } catch (err) {

      console.log(err);

      toast.error("Something went wrong");

    }
  };

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-8 w-[500px]">

        <div className="flex justify-between mb-6">

          <h2 className="text-2xl font-bold">
            {category ? "Edit Category" : "Add Category"}
          </h2>

          <button onClick={onClose}>
            ✖
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="border rounded-xl p-3 w-full"
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="border rounded-xl p-3 w-full"
          />

          <button
            className="bg-dogra-maroon text-white w-full py-3 rounded-xl"
          >
            Save Category
          </button>

        </form>

      </div>

    </div>

  );

};

export default CategoryModal;