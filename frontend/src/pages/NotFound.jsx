import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container-app py-24 text-center">
    <h1 className="font-display text-6xl font-extrabold text-dogra-maroon dark:text-dogra-gold mb-4">404</h1>
    <p className="text-slate-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
