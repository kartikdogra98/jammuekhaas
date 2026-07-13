import { FiBell, FiSearch } from "react-icons/fi";

const AdminNavbar = () => {
  return (
    <header className="bg-white shadow px-8 h-20 flex items-center justify-between">

      <div className="relative w-96">

        <FiSearch className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full h-12 rounded-xl border pl-12 pr-4 focus:outline-none"
        />

      </div>

      <div className="flex items-center gap-6">

        <button className="relative">

          <FiBell size={24} />

          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        <img
          src="/images/admin.jpg"
          alt="Admin"
          className="w-12 h-12 rounded-full border"
        />

      </div>

    </header>
  );
};

export default AdminNavbar;