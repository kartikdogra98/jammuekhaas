import { useEffect, useState } from 'react';
import api from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const load = () => api.get('/notifications').then((res) => setNotifications(res.data.notifications));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="container-app py-10 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">Notifications</h1>
        <button
          onClick={async () => { await api.patch('/notifications/read-all'); load(); }}
          className="text-sm text-dogra-maroon dark:text-dogra-gold"
        >
          Mark all as read
        </button>
      </div>
      {notifications.length === 0 ? (
        <p className="text-slate-500">You have no notifications.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markRead(n._id)}
              className={`card p-4 cursor-pointer ${!n.isRead ? 'border-l-4 border-dogra-maroon' : ''}`}
            >
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-slate-500">{n.message}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
