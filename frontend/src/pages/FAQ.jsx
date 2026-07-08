import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  { q: 'How do I place an order?', a: 'Browse restaurants, add items to your cart, and check out using Cash on Delivery or online payment via Razorpay.' },
  { q: 'What areas do you deliver to?', a: 'We currently deliver across major localities in Jammu city, with more areas coming soon.' },
  { q: 'How can I track my order?', a: 'Visit "My Orders" and open any active order to see live status updates.' },
  { q: 'Can I cancel my order?', a: 'Yes, orders can be cancelled before they enter the "preparing" stage from the order details page.' },
  { q: 'How do I become a delivery partner or list my restaurant?', a: 'Register with the appropriate role (Restaurant Owner or Delivery Partner) and complete your profile from the dashboard.' },
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="container-app py-16 max-w-2xl">
      <h1 className="font-display text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqs.map((item, idx) => (
          <div key={idx} className="card p-4">
            <button onClick={() => setOpen(open === idx ? null : idx)} className="w-full flex justify-between items-center font-medium">
              {item.q}
              <FiChevronDown className={`transition-transform ${open === idx ? 'rotate-180' : ''}`} />
            </button>
            {open === idx && <p className="text-slate-500 mt-2 text-sm">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
