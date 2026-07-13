import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">

      <AdminSidebar />

      <div className="flex-1">

        <AdminNavbar />

        <main className="p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;