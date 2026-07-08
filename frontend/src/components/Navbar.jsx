import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiBell } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { logoutUser } from '../redux/slices/authSlice';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const itemCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  const dashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'restaurant') return '/restaurant-dashboard';
    if (user?.role === 'delivery') return '/delivery-dashboard';
    return '/profile';
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };
 
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-dogra-slate/95 backdrop-blur-md shadow-sm">
      <div className="container-app flex items-center justify-between h-16">
      <Link to="/" className="flex items-center gap-3 font-display font-extrabold">
            <img src="/images/logo.png" alt="Jammu-e-Khaas" className="w-12 h-12 rounded-full object-cover"/>
                  <span className="text-2xl font-extrabold text-dogra-maroon dark:text-dogra-gold">Jammu-e-Khaas</span>
      </Link>
        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/restaurants" className="hover:text-dogra-maroon dark:hover:text-dogra-gold transition-colors">Restaurants</Link>
          <Link to="/about" className="hover:text-dogra-maroon dark:hover:text-dogra-gold transition-colors">About</Link>
          <Link to="/contact" className="hover:text-dogra-maroon dark:hover:text-dogra-gold transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {user && (
            <>
              <Link to="/wishlist" aria-label="Wishlist" className="relative">
                <FiHeart className="text-xl hover:text-dogra-maroon" />
              </Link>
              <Link to="/notifications" aria-label="Notifications" className="relative">
                <FiBell className="text-xl hover:text-dogra-maroon" />
              </Link>
            </>
          )}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="text-xl hover:text-dogra-maroon" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-dogra-maroon text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={dashboardPath()} className="flex items-center gap-1 font-medium hover:text-dogra-maroon">
                <FiUser /> {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn-outline text-sm py-1.5 px-4">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-5">Login</Link>
          )}
        </div>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-dogra-slate border-t border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="container-app py-4 flex flex-col gap-4">
              <Link to="/restaurants" onClick={() => setOpen(false)}>Restaurants</Link>
              <Link to="/cart" onClick={() => setOpen(false)}>Cart ({itemCount})</Link>
              <Link to="/about" onClick={() => setOpen(false)}>About</Link>
              <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
              {user ? (
                <>
                  <Link to={dashboardPath()} onClick={() => setOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="btn-outline w-fit">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-fit">Login</Link>
              )}
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
