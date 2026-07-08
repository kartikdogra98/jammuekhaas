import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import api from '../api/axios';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ label: 'Home', street: '', city: 'Jammu', pincode: '', phone: '', isDefault: false });

  const load = () => api.get('/addresses').then((res) => setAddresses(res.data.addresses));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', form);
      toast.success('Address added');
      setForm({ label: 'Home', street: '', city: 'Jammu', pincode: '', phone: '', isDefault: false });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add address');
    }
  };

  const remove = async (id) => {
    await api.delete(`/addresses/${id}`);
    load();
  };

  return (
    <div className="container-app py-10 max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">My Addresses</h1>
      <div className="space-y-3 mb-8">
        {addresses.map((addr) => (
          <div key={addr._id} className="card p-4 flex justify-between items-start">
            <div>
              <strong>{addr.label}</strong> {addr.isDefault && <span className="text-xs text-green-600">(Default)</span>}
              <p className="text-sm text-slate-500">{addr.street}, {addr.city} - {addr.pincode}</p>
              <p className="text-sm text-slate-500">📞 {addr.phone}</p>
            </div>
            <button onClick={() => remove(addr._id)} className="text-red-500"><FiTrash2 /></button>
          </div>
        ))}
        {addresses.length === 0 && <p className="text-slate-500">No saved addresses yet.</p>}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Add New Address</h3>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input-field col-span-2">
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
          <input required placeholder="Street" className="input-field col-span-2" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          <input required placeholder="City" className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input required placeholder="Pincode" className="input-field" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
          <input required placeholder="Phone" className="input-field col-span-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label className="flex items-center gap-2 col-span-2 text-sm">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Set as default
          </label>
          <button type="submit" className="btn-primary col-span-2">Save Address</button>
        </form>
      </div>
    </div>
  );
};

export default Addresses;
