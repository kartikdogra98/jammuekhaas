import { FiBell, FiSearch, FiMenu } from "react-icons/fi";


const AdminNavbar = ({
  setSidebarOpen,
  }) => {
  return (
    <header className="bg-white dark:bg-slate-800 dark:text-white shadow px-4 sm:px-8 h-20 flex items-center justify-between">

<div className="flex items-center gap-4">

    <button
    className="lg:hidden"
    onClick={() => setSidebarOpen(true)}
    >
    <FiMenu size={26}/>
    </button>

    <div className="relative hidden lg:block flex-1 max-w-md">

        <FiSearch className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full h-12 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 pl-12 pr-4 focus:outline-none"
        />

</div>

</div>
<div className="flex items-center gap-3 sm:gap-6">

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