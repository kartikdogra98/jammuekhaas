import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    api
      .get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('failed'));
  }, [token]);

  return (
    <div className="container-app py-24 text-center">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <>
          <h1 className="font-display text-2xl font-bold mb-3">Email Verified! 🎉</h1>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </>
      )}
      {status === 'failed' && (
        <>
          <h1 className="font-display text-2xl font-bold mb-3">Verification Failed</h1>
          <p className="text-slate-500 mb-4">This link is invalid or has expired.</p>
          <Link to="/" className="btn-outline">Go Home</Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
