import axios from 'axios';

// In dev, Vite proxies '/api' to localhost:5000 (see vite.config.js) so the
// relative path works fine. In production (e.g. deployed on Vercel), there
// is no such proxy — the frontend and backend live on different domains —
// so VITE_API_URL must be set to the real backend URL, e.g.
// https://your-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jek_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jek_token');
    }
    return Promise.reject(err);
  }
);

export default api;