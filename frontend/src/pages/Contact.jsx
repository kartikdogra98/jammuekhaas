import { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    toast.success("Thanks for reaching out! We'll get back to you soon.");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container-app py-16 max-w-xl">
      <h1 className="font-display text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <input required placeholder="Your Name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Your Email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea required placeholder="Your Message" rows={5} className="input-field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button type="submit" className="btn-primary w-full">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
