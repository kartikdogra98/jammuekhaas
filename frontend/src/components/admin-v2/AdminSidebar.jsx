import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiCoffee,
  FiClipboard,
  FiUsers,
  FiGrid,
  FiTag,
  FiStar,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const menuItems = [
  { title: "Dashboard", icon: FiHome, path: "/admin" },
  { title: "Restaurants", icon: FiShoppingBag, path: "/admin/restaurants" },
  { title: "Foods", icon: FiCoffee, path: "/admin/foods" },
  { title: "Orders", icon: FiClipboard, path: "/admin/orders" },
  { title: "Users", icon: FiUsers, path: "/admin/users" },
  { title: "Categories", icon: FiGrid, path: "/admin/categories" },
  { title: "Coupons", icon: FiTag, path: "/admin/coupons" },
  { title: "Reviews", icon: FiStar, path: "/admin/reviews" },
  { title: "Reports", icon: FiBarChart2, path: "/admin/reports" },
  { title: "Settings", icon: FiSettings, path: "/admin/settings" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen shadow-xl flex flex-col">

      <div className="h-20 flex items-center justify-center border-b border-slate-700">

        <div className="text-center">

          <h1 className="text-2xl font-bold text-dogra-gold">
            Jammu-e-Khaas
          </h1>

          <p className="text-xs text-gray-400">
            ADMIN PANEL
          </p>

        </div>

      </div>

      <div className="p-5">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-xl mb-2 transition-all duration-300 ${
                  isActive
                    ? "bg-dogra-maroon text-white shadow-lg"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </NavLink>
          );
        })}

      </div>

      <div className="mt-auto p-5 border-t border-slate-700">
  <button className="w-full flex items-center gap-4 bg-red-600 hover:bg-red-700 rounded-xl py-4 px-5 transition">
    <FiLogOut size={20} />
    Logout
  </button>
</div>

    </aside>
  );
};

export default AdminSidebar;