import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="flex min-h-screen overflow-x-hidden bg-slate-100 dark:bg-slate-900">

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 min-w-0">

        <AdminNavbar
          setSidebarOpen={setSidebarOpen}
        />

<main className="overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>

  );
};

export default AdminLayout;