import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiMapPin, FiShoppingBag, FiHeart, FiBell } from 'react-icons/fi';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className="container-app py-10 max-w-2xl">
      <div className="card p-6 flex items-center gap-4 mb-6">
        <img
          src={user.avatar?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="font-display text-xl font-bold">{user.name}</h1>
          <p className="text-slate-500 text-sm">{user.email}</p>
          <span className="inline-block mt-1 text-xs bg-dogra-maroon text-white px-2 py-0.5 rounded-full capitalize">{user.role}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/orders" className="card p-5 flex items-center gap-3 hover:shadow-lg transition-shadow">
          <FiShoppingBag className="text-2xl text-dogra-maroon" /> My Orders
        </Link>
        <Link to="/addresses" className="card p-5 flex items-center gap-3 hover:shadow-lg transition-shadow">
          <FiMapPin className="text-2xl text-dogra-maroon" /> My Addresses
        </Link>
        <Link to="/wishlist" className="card p-5 flex items-center gap-3 hover:shadow-lg transition-shadow">
          <FiHeart className="text-2xl text-dogra-maroon" /> Wishlist
        </Link>
        <Link to="/notifications" className="card p-5 flex items-center gap-3 hover:shadow-lg transition-shadow">
          <FiBell className="text-2xl text-dogra-maroon" /> Notifications
        </Link>
      </div>
    </div>
  );
};

export default Profile;
