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

      setUsers(data.users);
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
    <div>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Users Management
          </h1>

          <p className="text-gray-500">
            Manage all users
          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">

        <input
          placeholder="Search User..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl p-3"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option value="">All Roles</option>

          <option value="customer">Customer</option>

          <option value="restaurant">Restaurant</option>

          <option value="delivery">Delivery</option>

          <option value="admin">Admin</option>

        </select>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="p-4 text-left">Name</th>

                  <th>Email</th>

                  <th>Role</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="border-b"
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
                        className="border rounded-lg p-2"
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
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
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

                      <button
                        onClick={() =>
                          deleteUser(user._id)
                        }
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <FiTrash2 />
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default Users;