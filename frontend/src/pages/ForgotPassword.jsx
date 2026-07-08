import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-16 flex justify-center">
      <div className="card max-w-md w-full p-8">
        <h1 className="font-display text-2xl font-bold mb-4 text-center">Reset Password</h1>
        {sent ? (
          <p className="text-center text-slate-500">Check your email for a password reset link.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="input-field" required />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
