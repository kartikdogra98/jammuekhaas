import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { fetchMe } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cartSlice';

import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import CustomerOrders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

// Admin V2
import AdminLayout from "./components/admin-v2/AdminLayout";

import Dashboard from "./pages/admin-v2/Dashboard";
import Restaurants from "./pages/admin-v2/Restaurants";
import Foods from "./pages/admin-v2/Foods";
import AdminOrders from "./pages/admin-v2/Orders";
import Users from "./pages/admin-v2/Users";
import Categories from "./pages/admin-v2/Categories";
import Coupons from "./pages/admin-v2/Coupons";
import Reports from "./pages/admin-v2/Reports";
import Settings from "./pages/admin-v2/Settings";

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user, dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
  
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
  
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
  
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <CustomerOrders />
            </ProtectedRoute>
          }
        />
  
  <Route
  path="/admin/*"
  element={
    <ProtectedRoute roles={["admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="restaurants" element={<Restaurants />} />
  <Route path="foods" element={<Foods />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="users" element={<Users />} />
  <Route path="categories" element={<Categories />} />
  <Route path="coupons" element={<Coupons />} />
  <Route path="reports" element={<Reports />} />
  <Route path="settings" element={<Settings />} />
</Route>
  
        <Route
          path="/restaurant-dashboard"
          element={
            <ProtectedRoute roles={["restaurant", "admin"]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
  
        <Route
          path="/delivery-dashboard"
          element={
            <ProtectedRoute roles={["delivery", "admin"]}>
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />
  
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </Layout>
  );
}

export default App;
