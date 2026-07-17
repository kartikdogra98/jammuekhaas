import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiTrash2,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, updates) => {
    try {
      await api.put(`/admin/users/${id}`, updates);

      toast.success("User Updated");

      fetchUsers();
    } catch (err) {
      console.log(err);

      toast.error("Update Failed");
    }
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/users/${id}`);

      toast.success("User Deleted");

      fetchUsers();
    } catch (err) {
      console.log(err);

      toast.error("Delete Failed");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="text-slate-900 dark:text-white">

<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Users Management
          </h1>

          <p className="text-gray-500 dark:text-gray-300">
            Manage all users
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

        <input
          placeholder="Search User..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl p-3"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl p-3"
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant</option>
          <option value="delivery">Delivery</option>
          <option value="admin">Admin</option>
        </select>

      </div>

      {loading ? (

        <p className="text-center py-10 text-slate-700 dark:text-gray-300">
          Loading Users...
        </p>

      ) : (

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-transparent dark:border-slate-700">

          <div className="overflow-x-auto">

          <table className="min-w-[700px] w-full">

              <thead className="bg-slate-100 dark:bg-slate-700">

                <tr>

                  <th className="p-4 text-left">Name</th>

                  <th className="text-left">Email</th>

                  <th className="text-left">Role</th>

                  <th className="text-left">Status</th>

                  <th className="text-center">Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500 dark:text-gray-300"
                    >
                      No Users Found
                    </td>

                  </tr>

                ) : (

                  filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >

                      <td className="p-4">
                        {user.name}
                      </td>

                      <td>{user.email}</td>

                      <td>

                        <select
                          value={user.role}
                          onChange={(e) =>
                            updateUser(user._id, {
                              role: e.target.value,
                            })
                          }
                          className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg p-2"
                        >
                          <option value="customer">
                            Customer
                          </option>

                          <option value="restaurant">
                            Restaurant
                          </option>

                          <option value="delivery">
                            Delivery
                          </option>

                          <option value="admin">
                            Admin
                          </option>

                        </select>

                      </td>

                      <td>

                        <button
                          onClick={() =>
                            updateUser(user._id, {
                              isActive: !user.isActive,
                            })
                          }
                          className={`px-4 py-2 rounded-lg ${
                            user.isActive
                              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {user.isActive ? (
                            <FiUserCheck />
                          ) : (
                            <FiUserX />
                          )}
                        </button>

                      </td>

                      <td>

                        <div className="flex justify-center">

                          <button
                            onClick={() =>
                              deleteUser(user._id)
                            }
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition"
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

    </div>
  );
};

export default Users;