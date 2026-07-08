import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-dogra-maroonDark text-dogra-cream mt-16">
    <div className="container-app py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
      <h3 className="font-display font-bold text-xl mb-3 flex items-center gap-2">
  <img
    src="/images/logo.png"
    alt="Jammu-e-Khaas"
    className="w-12 h-12 rounded-full object-cover"
  />
  <span className="text-2xl font-extrabold text-dogra-maroon dark:text-dogra-gold">Jammu-e-Khaas</span>
</h3>
        <p className="text-sm text-dogra-cream/80">
          Bringing the authentic taste of Jammu's Dogra cuisine straight to your doorstep.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Company</h4>
        <ul className="space-y-2 text-sm text-dogra-cream/80">
          <li><Link to="/about" className="hover:text-white">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Legal</h4>
        <ul className="space-y-2 text-sm text-dogra-cream/80">
          <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Get the app</h4>
        <p className="text-sm text-dogra-cream/80">Order from your phone soon — app coming shortly!</p>
      </div>
    </div>
    <div className="text-center text-xs text-dogra-cream/60 border-t border-white/10 py-4">
      © {new Date().getFullYear()} Jammu-e-Khaas. All rights reserved.
    </div>
  </footer>
);

export default Footer;
