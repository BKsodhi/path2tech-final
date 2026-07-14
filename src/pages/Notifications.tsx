import React, { useEffect, useState } from 'react';
import { Bell, FileText, CheckCircle, Code2, TriangleAlert, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Notifications() {
  const { token } = useAppContext();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = () => {
    fetch('/api/notifications', {
      headers: { 'x-auth-token': token || '' }
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const markAllRead = () => {
    fetch('/api/notifications/read-all', {
      method: 'PUT',
      headers: { 'x-auth-token': token || '' }
    })
      .then(() => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
      })
      .catch(err => console.error(err));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-emerald-400" />;
      case 'warning': return <TriangleAlert size={20} className="text-amber-400" />;
      case 'error': return <TriangleAlert size={20} className="text-rose-400" />;
      default: return <Info size={20} className="text-cyan-400" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'emerald';
      case 'warning': return 'amber';
      case 'error': return 'rose';
      default: return 'cyan';
    }
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "none" }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Notifications</h2>
            <p className="text-sm text-slate-400">Stay up to date with your progress and system alerts.</p>
          </div>
          <button 
            onClick={markAllRead}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-8 text-sm">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">No new notifications!</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id} className={`bg-[#111e35] border ${n.unread ? "border-cyan-500/30" : "border-white/[0.06]"} rounded-2xl p-4 flex gap-4 transition-colors`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-${getColor(n.type)}-500/15`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-bold ${n.unread ? "text-white" : "text-slate-300"}`}>{n.title}</h3>
                    <span className="text-[10px] font-medium text-slate-500">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{n.desc}</p>
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
